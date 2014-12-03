declare("Static", function() {
	include("Assert");
    include("Component");

    Static.prototype = component.create();
    Static.prototype.$super = parent;
    Static.prototype.constructor = Static;
    
    function Static() {
        this.id = 'Static';
        
        this.mouseButtons = {
                1: { name: StrLoc('Left button') },
                2: { name: StrLoc('Middle button') },
                3: { name: StrLoc('Right button') },
        };
        
        this.EnumMouseButtonLeft = 1;
        this.EnumMouseButtonMiddle = 2;
        this.EnumMouseButtonRight = 3;
        
        this.modules = {
        		0: { id: 'Synthesize', name: StrLoc('Synthesize') },
        		1: { id: 'Base', name: StrLoc('Base') },
        		2: { id: 'Rpg', name: StrLoc('Rpg') }
        };
        
        this.EnumModuleSynthesize = 0;
        this.EnumModuleBase = 1;
        this.EnumModuleRpg = 2;
        
        this.rarity = {
				0: { id: 'trash', name: StrLoc('Trash') },
        		1: { id: 'common', name: StrLoc('Common') },
        		2: { id: 'uncommon', name: StrLoc('Uncommon') },
        		3: { id: 'rare', name: StrLoc('Rare') },
        		4: { id: 'epic', name: StrLoc('Epic') },
        		5: { id: 'legendary', name: StrLoc('Legendary') }
        };
        
        this.EnumRarityTrash = 0;
        this.EnumRarityCommon = 1;
        this.EnumRarityUncommon = 2;
        this.EnumRarityRare = 3;
        this.EnumRarityEpic = 4;
        this.EnumRarityLegendary = 5;
        
        this.rpgSlots = {
				0 : { id: 'head', name: StrLoc('Head') },
				1 : { id: 'neck', name: StrLoc('Neck') },
				2 : { id: 'chest', name: StrLoc('Chest') },
				3 : { id: 'waist', name: StrLoc('Waist') },
				4 : { id: 'legs', name: StrLoc('Legs') },
				5 : { id: 'feet', name: StrLoc('Feet') },
				6 : { id: 'shoulder', name: StrLoc('Shoulder') },
				7 : { id: 'wrists', name: StrLoc('Wrists') },
				8 : { id: 'hands', name: StrLoc('Hands') },
				9 : { id: 'ring1', name: StrLoc('Ring') },
				10: { id: 'ring2', name: StrLoc('Ring') },
				11: { id: 'ears', name: StrLoc('Ears') },
				12: { id: 'mainHand', name: StrLoc('Main Hand') },
				13: { id: 'offHand', name: StrLoc('Off Hand') },
				14: { id: 'utility1', name: StrLoc('Utility') },
				15: { id: 'utility2', name: StrLoc('Utility') },
		};
		
		this.EnumRpgSlotHead = 0;
		this.EnumRpgSlotNeck = 1;
		this.EnumRpgSlotChest = 2;
		this.EnumRpgSlotWaist = 3;
		this.EnumRpgSlotLegs = 4;
		this.EnumRpgSlotFeet = 5;
		this.EnumRpgSlotShoulder = 6;
		this.EnumRpgSlotWrists = 7;
		this.EnumRpgSlotHands = 8;
		this.EnumRpgSlotRing1 = 9;
		this.EnumRpgSlotRing2 = 10;
		this.EnumRpgSlotEars = 11;
		this.EnumRpgSlotMainHand = 12;
		this.EnumRpgSlotOffHand = 13;
		this.EnumRpgSlotUtility1 = 14;
		this.EnumRpgSlotUtility2 = 15;
		
		this.rpgStats = {
				0 : { id: 'str', name: StrLoc('Strength') },
				1 : { id: 'agi', name: StrLoc('Agility') },
				2 : { id: 'int', name: StrLoc('Intelligence') },
				3 : { id: 'sta', name: StrLoc('Stamina') },
		};
		
		this.EnumRpgStatStr = 0;
		this.EnumRpgStatAgi = 1;
		this.EnumRpgStatInt = 2;
		this.EnumRpgStatSta = 3;
        
        this.stats = {
        		0: { id: 'autoSaveCount', name: StrLoc('Auto save count') },
        		1: { id: 'gameLoadCount', name: StrLoc('Game load count') },
        		2: { id: 'playTime', name: StrLoc('Play time') },
        		3: { id: 'sessionCount', name: StrLoc('Session count') },
        		4: { id: 'synthAuto', name: StrLoc('Auto synthesize') },
        		5: { id: 'synthAutoResult', name: StrLoc('Auto synthesize gain') },
        		6: { id: 'synthManual', name: StrLoc('Manual synthesize') },        		
        		7: { id: 'synthManualResult', name: StrLoc('Manual synthesize gain') },
        		
        		// Server stats
        		100001: { id: 'serverSaveCount', name: StrLoc('Server save count') }
        };
        
        this.EnumAutoSaveCount = 0;
        this.EnumStatGameLoadCount = 1;
        this.EnumStatPlayTime = 2;
        this.EnumStatSessionCount = 3;
        this.EnumStatSynthAuto = 4;
        this.EnumStatSynthAutoGain = 5;
        this.EnumStatSynthManual = 6;
        this.EnumStatSynthManualGain = 7;
        this.EnumStatServerSaveCount = 100001;
        
        this.valueGainTypes = {
        	0: { id: 'undefined', name: StrLoc('Undefined') },
        	1: { id: 'manual', name: StrLoc('Manual') },
        	2: { id: 'manualCrit', name: StrLoc('Manual crit') },
        	3: { id: 'auto', name: StrLoc('Auto') },
        	4: { id: 'autoCrit', name: StrLoc('Auto crit') }
        };
        
        this.EnumValueGainUndefined = 0;
        this.EnumValueGainManual = 1;
        this.EnumValueGainManualCrit = 2;
        this.EnumValueGainAuto = 3;
        this.EnumValueGainAutoCrit = 4;
        
        this.keyCodes = {
        		13: { id: 'enter', name: StrLoc('Enter') }
        };
        
        this.EnumKeyCodeEnter = 13;
        
        // ---------------------------------------------------------------------------
        // data functions
        // ---------------------------------------------------------------------------
        this.setRoot = function(root) {
            this.root = root;
            this.imageRoot = this.root;
            this.iconRoot = this.imageRoot + "icons/";
            this.cssRoot = this.root + "css/";
            
            this.enableDragDrop = true;
            this.dragDelay = 300; // delay before starting to drag
            
            this.floatFadeDelay = 300; // delay for floating windows to fade on close 
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
    
    return new Static();
});

