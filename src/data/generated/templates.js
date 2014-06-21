define(function() {
    return {
        'MainScreen': '<div id="{{id}}" class="noSelect screen"></div>',
        
        'PluginBar': '<div class="noSelect pluginBar"></div>',
       
        'OptionPanel': '<div id="{{id}}" class="noSelect optionPanel inline">\
                <div id="{{id}}_bg" class="noSelect panelBackground"></div>\
                <div class="noSelect panelContentFrame panelContentBorder">\
                    <div class="noSelect panelContentBackground"></div>\
                    <div id="{{id}}_content" class="noSelect panelContent"></div>\
                </div>\
                <div id="{{id}}_btClose" class="noSelect clickable panelButton panelButtonClose panelButtonText">x</div>\
                <div id="{{id}}_btInfo" class="noSelect clickable panelButton panelButtonInfo panelButtonText">i</div>\
                <div id="{{id}}_title" class="noSelect noIBar defaultFontColor panelTitle"></div>\
            </div>',

         'ControlPanelFrame': '<div class="noSelect controlPanelFrame"></div>',
         
         'ControlPanel': '<div id="{{id}}" class="noSelect controlPanel">\
                <div id="{{id}}_bg" class="noSelect panelBackground"></div>\
                <div class="noSelect controlPanelContentFrame panelContentBorder">\
                    <div class="noSelect panelContentBackground"></div>\
                    <div id="{{id}}_content" class="noSelect controlPanelContent"></div>\
                </div>\
            </div>',
            
         'StatisticsView': '<div id="{{id}}" class="noSelect contentProvider">\
                 <div class="noSelect statisticsSection">\
                     <div class="noSelect noIBar defaultFontColor statisticsHeader">All time:</div>\
                     <hr class="noSelect statisticsDivider"/>\
                     <table id="{{id}}_totalContent"></table>\
                 </div>\
                 <div class="noSelect statisticsSection">\
                     <div class="noSelect noIBar defaultFontColor statisticsHeader">This session:</div>\
                     <hr class="noSelect statisticsDivider"/>\
                     <table id="{{id}}_sessionContent"></table>\
                 </div>\
             </div>',
             
         'StatisticsViewEntry': '<tr>\
                 <td><div class="noSelect noIBar defaultFontColor statisticsContent">{{name}}:&nbsp;</div></td>\
                 <td id="{{id}}_value" class="noSelect noIBar defaultFontColor statisticsContent"></td>\
             </tr>',
    };
});