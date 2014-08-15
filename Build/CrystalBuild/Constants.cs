namespace CrystalBuild
{
    using CarbonCore.Utils.IO;

    public static class Constants
    {
        // -------------------------------------------------------------------
        // Public
        // -------------------------------------------------------------------
        public const string DefaultProjectName = "Crystal";

        public const string DefaultProjectTarget = DefaultProjectName + CarbonCore.Utils.Constants.ExtensionJavaScript;
        public const string DefaultTemplateTarget = "templates" + CarbonCore.Utils.Constants.ExtensionJavaScript;
        public const string DefaultDataTarget = "data" + CarbonCore.Utils.Constants.ExtensionJavaScript;

        public const string FilterSource = "*" + CarbonCore.Utils.Constants.ExtensionJavaScript;
        public const string FilterTemplates = "*" + CarbonCore.Utils.Constants.ExtensionHtml;
        public const string FilterData = "*" + CarbonCore.Utils.Constants.ExtensionCsv;

        public const string JsonBuildPrefix = "define(function() { return {";
        public const string JsonBuildPostfix = "}; });";

        public static readonly CarbonDirectory DataDirectory = new CarbonDirectory("data");
        public static readonly CarbonDirectory DataCssDirectory = DataDirectory.ToDirectory("css");
        public static readonly CarbonDirectory DataTemplateDirectory = DataDirectory.ToDirectory("templates");
        public static readonly CarbonDirectory SourceDirectory = new CarbonDirectory("src");
        public static readonly CarbonDirectory SourceDataDirectory = SourceDirectory.ToDirectory("data");
        public static readonly CarbonDirectory SourceDataGeneratedDirectory = SourceDataDirectory.ToDirectory("generated");
        public static readonly CarbonDirectory OutputDirectory = new CarbonDirectory("bin");
    }
}
