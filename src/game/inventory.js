define(function(require) {
    var save = require('save');
    var assert = require('assert');
    
    // ---------------------------------------------------------------------------
    // internal functions
    // ---------------------------------------------------------------------------    
    this.getSlotIndex = function(self, id) {
        if(self.itemSlotMap[id] === undefined) {
            return undefined;
        }
        
        return self.itemSlotMap[id];
    };
    
    this.assignSlot = function(self, id) {
        updateFreeSlot(self);
        
        var slotIndex = self.nextFreeSlot++;
        var slot = self.getSlotAt(slotIndex);
        slot.id = id;
        slot.count = 0;
        
        return slotIndex;
    };
    
    this.releaseSlot = function(self, slot) {
        var itemId = slot.id;
        var slotNumber = self.itemSlotMap[itemId];
        
        this.clearSlot(slot);
        
        self.nextFreeSlot = slotNumber;
        delete self.itemSlotMap[itemId];
    };
    
    this.clearSlot = function(slot) {
        slot.id = undefined;
        slot.count = 0;
        slot.metadata = undefined;
    };
    
    this.newSlot = function() {
        return { id: undefined, count: 0, metadata: undefined };
    };
    
    this.updateFreeSlot = function(self) {
        var found = false;
        while(found === false) {
            assert.isFalse(self.nextFreeSlot >= self.allocationLimit, "Slot count reached allocation limit: " + self.nextFreeSlot + " >= " + self.allocationLimit);
            
            if(self.itemSlots.length <= self.nextFreeSlot) {
                // Allocate a new set of slots, we reached the end
                for(var i = 0; i < self.allocationCount; i++) {
                    self.itemSlots.push(this.newSlot());
                };
            }
            
            var slot = self.getSlotAt(self.nextFreeSlot);
            if(slot.id === undefined) {
                found = true;
            } else {
                self.nextFreeSlot++;
            };
        };
    };
    
    this.rebuildSlotMap = function(self) {
        self.itemSlotMap = {};
        for(var i = 0; i < self.itemSlots.length; i++) {
            var itemId = self.itemSlots[i].id;
            if(itemId === undefined) {
                continue;
            }
            
            self.itemSlotMap[itemId] = i;
        };
    };
    
    // ---------------------------------------------------------------------------
    // Inventory object
    // ---------------------------------------------------------------------------
    Inventory.prototype = Crystal.createComponent();
    Inventory.prototype.$super = parent;
    Inventory.prototype.constructor = Inventory;
    
    function Inventory(id) {
        
        this.id = id;
        
        // Allocate slots in multiples of 6 by default
        this.allocationCount = 6;
        this.allocationLimit = 1000; // Hard-limit the inventory to 1k slots for now
        
        // Items are stored in a slot like system as a 2 dim array with [id, count]
        save.register(this, 'itemSlots').asJsonArray().withCallback(false, true, true);
        this.itemSlotMap = {};
        this.nextFreeSlot = 0;
        
        // Global limit will make the inventory hold only n amount of items total and refuse any more after
        this.globalCount = 0;
        this.globalLimit = undefined;
        
        // Overrides can change the limit for an individual item and ignore the native limit set on the item
        this.limitOverrides = {};
        
        this.changed = false;
        
        // ---------------------------------------------------------------------------
        // inventory functions
        // ---------------------------------------------------------------------------
        this.setChanged = function(value) {
            this.changed = value || true;
        };
        
        this.getChanged = function() {
            return this.changed;
        };
        
        this.canAdd = function(id) {
            assert.isDefined(id);
            
            // Check global limit first since it's the easiest test
            if(this.globalLimit !== undefined && this.globalCount >= this.globalLimit) {
                return false;
            }
            
            // Get the individual override
            var limitOverride = this.limitOverrides[id];
            if(limitOverride !== undefined && limitOverride <= 0) {
                // If we are not allowed to store this item at all bail out right away
                return false;
            }
            
            // Find the slot of the item
            var slotIndex = getSlotIndex(this, id);
            if (slotIndex === undefined) {
                // We don't have the item but we are allowed to store so accept
                return true;
            }
            
            var slot = this.getSlotAt(slotIndex);
            var currentCount = slot.count;
            if(limitOverride !== undefined && currentCount >= limitOverride) {
                // Check if we already have as much as the override allows and bail
                return false;
            }
                
            // See if this item has limited capacity
            /*var limit = data.getItemInventoryLimit(id);
            if (limit !== undefined && currentCount >= limit) {
                // We have reached the default capacity
                return false;
            }*/
    
            // Item is good to add
            return true;
        };
    
        this.add = function(id, value) {
            assert.isDefined(id);
            
            // This is a costly assert so we should get rid of it eventually
            //  but right now i want to make sure all code that adds things is aware of calling canAdd
            assert.isTrue(this.canAdd(id), "Item can not be added, call canAdd(<id>) before calling add(<id>)");
            
            // Calling add(<id>) will add exactly 1
            if(value === undefined) {
                value = 1;
            }
    
            // Get the target slot
            var slotIndex = getSlotIndex(this, id);
            if(slotIndex === undefined) {
                slotIndex = assignSlot(this, id);
                assert.isDefined(slotIndex, "assignSlot failed!");
                this.itemSlotMap[id] = slotIndex;
            }
            
            // Add the item count to the slot
            var slot = this.getSlotAt(slotIndex);
            slot.count += value;
            this.changed = true;
        };
        
        this.remove = function(id, value) {
            assert.isDefined(id);
            
            // Todo: Remove later when the code is more hardened
            assert.isTrue(this.hasItem(id), "remove(<id>) called with non-existing item, call hasItem(<id>) first!");
            
            // Calling remove(<id>) will remove exactly 1
            if(value === undefined) {
                value = 1;
            }
            
            // Get the target slot
            var slotIndex = getSlotIndex(this, id);
            var slot = this.getSlotAt(slotIndex);
            if(slot.count <= value) {
                releaseSlot(this, slot);
                delete this.itemSlotMap[id];
            } else {
                slot.count -= value;
            }
            
            this.changed = true;
        };
        
        this.getSlotCount = function() {
            return this.slotCount;
        };
        
        this.getSlotAt = function(index) {
            assert.isTrue(index >= 0 && index < this.itemSlots.length);
            
            return this.itemSlots[index];
        };
        
        this.hasItem = function(id)
        {
            return this.itemSlotMap[id] != undefined;
        };
    
        this.getItems = function() {
            return Object.keys(this.itemSlotMap);
        };
    
        this.getItemCount = function(id) {
            var slotIndex = getSlotIndex(this, id);
            if(slotIndex === undefined) {
                return 0;
            }
    
            var slot = this.getSlotAt(slotIndex);
            return slot.count;
        };
        
        this.setMetadata = function(id, metadata) {
            var slotIndex = getSlotIndex(this, id);
            assert.isDefined(slotIndex, "setMetadata() called on invalid item: " + id);
            
            var slot = this.getSlotAt(slotIndex);
            slot.setMetadata(metadata);
        };
        
        this.getMetadata = function(id) {
            var slotIndex = getSlotIndex(this, id);
            assert.isDefined(slotIndex, "getMetadata() called on invalid item: " + id);
            
            var slot = this.getSlotAt(slotIndex);
            return slot.getMetadata();
        };
        
        // ---------------------------------------------------------------------------
        // loading / saving
        // ---------------------------------------------------------------------------    
        this.onLoad = function() {
            // We got new data, update our cache
            this.nextFreeSlot = 0;
            
            updateFreeSlot(this);
            rebuildSlotMap(this);
            
            this.changed = true;
        };
    
        this.onReset = function(fullReset) {
            this.itemSlotMap = {};
            
            this.changed = true;
            this.nextFreeSlot = 0;
        };
        
        
    };
    
    // Register into the main namespace
    Crystal.createInventory = function(id) { return new Inventory(id); };
});