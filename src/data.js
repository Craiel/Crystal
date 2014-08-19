declare("Data", function() {
	include("Assert");
    include("Component");

    Data.prototype = component.create();
    Data.prototype.$super = parent;
    Data.prototype.constructor = Data;
    
    function Data() {
        this.id = 'data';
        
        this.modules = {
        		0: { id: 'Synthesize', name: StrLoc('Synthesize') },
        		1: { id: 'Base', name: StrLoc('Base') },
        		2: { id: 'Rpg', name: StrLoc('Rpg') }
        };
        
        this.EnumModuleSynthesize = 0;
        this.EnumModuleBase = 1;
        this.EnumModuleRpg = 2;
        
        this.rarity = {
        		0: { id: 'Normal', name: StrLoc('Normal')},
        		1: { id: 'Uncommon', name: StrLoc('Uncommon')},
        		2: { id: 'Rare', name: StrLoc('Rare')},
        		3: { id: 'Epic', name: StrLoc('Epic')},
        		4: { id: 'Legendary', name: StrLoc('Legendary')}
        };
        
        this.EnumRarityNormal = 0;
        this.EnumRarityUncommon = 1;
        this.EnumRarityRare = 2;
        this.EnumRarityEpic = 3;
        this.EnumRarityLegendary = 4;
        
        this.stats = {
        		0: { id: 'autoSaveCount', name: 'Auto save count' },
        		1: { id: 'gameLoadCount', name: 'Game load count' },
        		2: { id: 'playTime', name: 'Play time' },
        		3: { id: 'sessionCount', name: 'Session count' },
        		4: { id: 'synthAuto', name: 'Auto synthesize' },
        		5: { id: 'synthAutoResult', name: 'Auto synthesize gain' },
        		6: { id: 'synthManual', name: 'Manual synthesize' },        		
        		7: { id: 'synthManualResult', name: 'Manual synthesize gain' }
        };
        
        this.EnumAutoSaveCount = 0;
        this.EnumStatGameLoadCount = 1;
        this.EnumStatPlayTime = 2;
        this.EnumStatSessionCount = 3;
        this.EnumStatSynthAuto = 4;
        this.EnumStatSynthAutoGain = 5;
        this.EnumStatSynthManual = 6;
        this.EnumStatSynthManualGain = 7;
        
        this.valueGainTypes = {
        	0: { id: 'undefined', name: 'Undefined' },
        	1: { id: 'manual', name: 'Manual' },
        	2: { id: 'manualCrit', name: 'Manual crit' },
        	3: { id: 'auto', name: 'Auto' },
        	4: { id: 'autoCrit', name: 'Auto crit' }
        };
        
        this.EnumValueGainUndefined = 0;
        this.EnumValueGainManual = 1;
        this.EnumValueGainManualCrit = 2;
        this.EnumValueGainAuto = 3;
        this.EnumValueGainAutoCrit = 4;
        
        // ---------------------------------------------------------------------------
        // data functions
        // ---------------------------------------------------------------------------
        this.setRoot = function(root) {
            this.root = root;
            this.imageRoot = this.root + "img/";
            this.iconRoot = this.imageRoot + "icons/";
            this.cssRoot = this.root + "css/";
            
            this.enableDragDrop = true;
            this.dragDelay = 300; // delay before starting to drag
            
            this.floatFadeDelay = 300; // delay for floating windows to fade on close 
            
            // Icons
            this.iconPlaceholder = 'placeholder.png';
        };
        
        this.getRarityName = function(rarity) {
        	assert.isTrue(rarity >= 0 && rarity < this.rarity.length);
        	
        	return this.rarity[rarity].name;
        };
        
        this.getRarityColor = function(rarity) {
        	assert.isTrue(rarity >= 0 && rarity < this.rarity.length);
        	
        	return 'colorRarity' + this.rarity[rarity].id;
        };
    };
    
    return new Data();
});

