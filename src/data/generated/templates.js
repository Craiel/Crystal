define(function() {
    return {
        'MainScreen': '<div id="{{id}}" class="screen"></div>',
        
        'OptionPanel': '<div id="{{id}}" class="controlPanel">\
                <div id="{{id}}_bg" class="noSelect panelBackground"></div>\
                <div id="{{id}}_content" class="noSelect panelContent panelContentBorder">\
                    <div id="{{id}}_content_bg" class="noSelect panelContentBackground"></div>\
                </div>\
                <div id="{{id}}_btClose" class="noSelect clickable panelButton panelButtonClose">x</div>\
                <div id="{{id}}_btInfo" class="noSelect clickable panelButton panelButtonInfo">i</div>\
            </div>',
            
         'MainControlPanel': '<div id="{{id}}" class="controlPanel">\
                <div id="{{id}}_bg" class="noSelect panelBackground"></div>\
                <div id="{{id}}_content" class="noSelect controlPanelContent panelContentBorder">\
                    <div id="{{id}}_content_bg" class="noSelect panelContentBackground"></div>\
                </div>\
            </div>'
    };
});