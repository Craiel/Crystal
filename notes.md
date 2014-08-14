Game components should be unlockable modules so the game itself can progress through the features and teach how to play. (Partially done)

The overall duration of the game should be fairly long until hitting the rest point.  Something around 2-4 weeks of non-active play.

Store the resources using the inventory class for the active player similar to mvm.
Store currency in an separate structure for easy access like a class or something.
Store research unlocks in a special class as well;  maybe a class that can hold these kinds of info and cache lookup info like names etc.

Show master xp and stats in status control on the left.  Increase the side panel size a little too make room for bigger stats.

Add some minor test and debug controls like sliders / plusminus progress controls for game speed, volume and showing the localstorage objects with name and editable text field.

Add the basic incremental functionality with buildings / tech coming from data.

Data from csv, edited via office or similar and imported to json via grunt process.  That will make it possible to div and be reasonably easy to edit.
But won't make it easy to have custom columns with calculating values since csv won't store that info. So best would be to keep source in xls, export manually to csv and import automatically via grunt.
This way  I can do fixes and diff directly but get to have more complex info in the xls.

Switch the modules in a popup menu on the bottom left side of the bar similar to a system menu.
Need to create a grouping of the button class for that which will call the callback and then close the menu if desired,  like a pop out control.
Also need a dialog control which wraps the panel in a div that overlays the page so you have to make a decision

First module is simple clicker to gain resources. The resource obtained is specified in tiered loot table so it can stay useful in later stages.
Add some simple automation buyables and upgrades on local module environment.

Basic Buildings:
Implant +1 manual,  20+
Basic assembler: 1 / tick, -1 power cost 100+
Basic processor: -0.1s tick -5 power cost, 250+
Basic holding cell: +1% limit, -1 power cost
Basic power cell: +50 power / tick

Intermediate ... lvl 10+
Advanced... lvl 30+
Industrial... lvl 60+

Upgrades:
Multi choice upgrades do reset can offer more then just the same gameplay.

Treat buildings as upgrades,  the stats are almost the same so I need to store if something can be bought only once or if it stacks.
That way I avoid coding similar systems and keep the data together, separate with tabs on the left side assigned via category in the data. Use a category enum to define this.
Store which upgrades are bought,  which choice was made and how many of them. 
Choice can not be changed after they where bought. 
This enables different buildings like faster ticks but less overall production. Less power consumption etc.



Basic Medical research / insurance : +10% implant or -15% implant cost or -1 repair or -2 power
Assembler tuning / auto repair: +10% assemblers or -15% repair cost

Layout for synth:
Center screen crystal to click on. 
Numbers floating like default. 
Have the buildings to the left of it and upgrades underneath in a smaller section. 
Buildings are icons with text and detailed tooltip of base,  actual and per second value of the building.

Upgrades can modify buildings or give flat increases.  Also need to add a little random clickable giving buff or flat value.
Then need to get prestige into the calculations as well and try it all out.  At that point the bare minimum clicker module should be playable. 
Then I need to add giving xp and make the player level increase properly. 
After that I need to get the system menu plugin and the module selector plugin to work so I can modify settings and switch to other modules.

Animate the loot gain outside the module in the bottom bar.

Second module is building a base.
Different buildings could be:
Process resources into more complex parts for crafting, buy / sell resources and gear, research upgrades and other game elements,  generate resources ...

Third module is going to be the rpg part with character, ideally a world roaming kind but lets start with simple mob spawing fighting style similar to aaid.
Will help to get all the mechanics and systems sorted out.
Display will be like phantasy star with party characters in the bottom and mobs on main screen.
Characters have different skills and stat curves,  based on the class they are. 
Skills are unlocked by level and can't be picked manually without special item or something similar.
Make a little logic language to control skill usage.
Have up to 5 characters active at the same time monsters up to 8 small, 4 medium,  2 huge or 1 boss. Can mix it by side.
Equip items via drag and drop if possible, but also have a hotkey method like in endless battle.
Would be neat to have the over equip system but that might be too complex...
Focus on very few stats at the start, all rpg stats are only used within that module so items and armor don't impact the global game.
But mobs and quests can give global rewards.

Skill usage settings ideas, will stop once a single skill was executed, little light will show if the line is correct or if there is a problem.
[Heal][Hp<50%]
[Fireball][Mp>50%][Strong]
[Attack][Weak]