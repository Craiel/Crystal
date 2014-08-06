define(function() { return {
	OptionsPanelButton: '<div id="{{id}}" class="noSelect optionsPanelButton clickable"><div id="{{id}}_overlay" class="noSelect overlay"></div><img id="{{id}}_icon" class="noSelect optionsPanelButtonIcon"/></div>',

	Panel: '<div id="{{id}}" class="noSelect optionPanel inline"><div id="{{id}}_bg" class="noSelect panelBackground colorInactiveBackground"></div>    <div class="noSelect panelContentFrame elementBorderDefault colorAccentBorder">    <div class="noSelect panelContentBackground colorDefaultBackground"></div>        <div id="{{id}}_content" class="noSelect panelContent"></div>    </div>    <div id="{{id}}_btClose" class="noSelect clickable panelButton colorAccent colorAccentBorder panelButtonClose panelButtonText">x</div>    <div id="{{id}}_btInfo" class="noSelect clickable panelButton colorAccent colorAccentBorder panelButtonInfo panelButtonText">i</div>    <div id="{{id}}_title" class="noSelect noIBar colorDefaultFont panelTitle"></div></div>',

	PluginBar: '<div class="noSelect pluginBar colorAccentBorder colorDefaultBackground"></div>',

	PluginTime: '<div class="noSelect pluginTimeFrame colorAccentBorder"><div class="noSelect noIBar pluginTimeContent colorDefaultFont"></div></div>',

	ProgressBar: '<div id="{{id}}" class="noSelect progressBarMain colorDefaultBackground">    <div class="noSelect progressBarContent colorAccentBackground colorDefaultFont"></div></div>',

	ScreenLoading: '<div id="{{id}}" class="noSelect screen">    <div class="noSelect screenLoadingBackground colorInactiveBackground"></div>    <div class="noSelect screenLoadingImage"></div>    <div class="noSelect screenLoadingProgressFrame">        <div id="{{id}}Progress" class="noSelect screenLoadingProgressBar">            <div class="noSelect progressBarContent colorAccentBackground colorDefaultFont"></div>        </div>        <div id="{{id}}ProgressText" class="noSelect screenLoadingProgressText"></div>    </div></div>',

	ScreenMain: '<div id="{{id}}" class="noSelect screen"><div id="{{id}}Content" class="noSelect screenMainGameContent"></div><div class="noSelect screenMainOptionsPanel"><div id="OptionsPanel" class="noSelect optionsPanel"><div class="noSelect panelBackground colorDefaultBackground"></div><div class="noSelect optionsPanelContentFrame colorAccentBorder"><div class="noSelect panelContentBackground colorDefaultBackground"></div><div id="OptionsPanelContent" class="noSelect optionsPanelContent"></div></div></div><div id="OptionsContent" class="noSelect screenMainOptionsContent"></div></div></div>',

	ScreenStart: '<div id="{{id}}" class="noSelect screen">    <div class="noSelect screenStartBackground colorInactiveBackground"></div>    <div class="noSelect screenStartImage"></div>    <div class="noSelect screenStartMenuFrame">    <div id="{{id}}MenuContent" class="noSelect screenStartMenuContent"></div>    </div></div>',

	ViewStatistics: '<div id="{{id}}" class="noSelect contentProvider scrollVertical"><div class="noSelect statisticsSection"><div class="noSelect noIBar colorDefaultFont statisticsHeader">All time:</div><hr class="noSelect statisticsDivider"/><table id="{{id}}_totalContent"></table></div><div class="noSelect statisticsSection"><div class="noSelect noIBar colorDefaultFont statisticsHeader">This session:</div><hr class="noSelect statisticsDivider"/><table id="{{id}}_sessionContent"></table></div></div>',

	ViewStatisticsEntry: '<tr><td><div class="noSelect noIBar colorDefaultFont statisticsContent">{{name}}:&nbsp;</div></td><td id="{{id}}_value" class="noSelect noIBar colorDefaultFont statisticsContent"></td></tr>',


}; });