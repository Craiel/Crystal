namespace CrystalBuild
{
    using System.Text.RegularExpressions;

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
        public const string DefaultStyleSheetTarget = DefaultProjectTarget + CarbonCore.Utils.Constants.ExtensionCss;

        public const string FilterSource = "*" + CarbonCore.Utils.Constants.ExtensionJavaScript;
        public const string FilterTemplates = "*" + CarbonCore.Utils.Constants.ExtensionHtml;
        public const string FilterData = "*" + CarbonCore.Utils.Constants.ExtensionCsv;
        public const string FilterStyleSheet = "*" + CarbonCore.Utils.Constants.ExtensionCss;
        public const string FilterContent = "*";

        public const string JsonBuildPrefix = @"declare(""{0}"", function() {{ return {{";
        public const string JsonBuildPostfix = "}; });";

        public static readonly Regex IncludeRegex = new Regex(@"\s+(include\((['""]\w+['""])\);)", RegexOptions.IgnoreCase);

        public static readonly CarbonDirectory DataDirectory = new CarbonDirectory("data");
        public static readonly CarbonDirectory DataCssDirectory = DataDirectory.ToDirectory("css");
        public static readonly CarbonDirectory DataTemplateDirectory = DataDirectory.ToDirectory("templates");
        public static readonly CarbonDirectory SourceDirectory = new CarbonDirectory("src");
        public static readonly CarbonDirectory SourceDataDirectory = SourceDirectory.ToDirectory("data");
        public static readonly CarbonDirectory SourceDataGeneratedDirectory = SourceDataDirectory.ToDirectory("generated");
        public static readonly CarbonDirectory OutputDirectory = new CarbonDirectory("bin");
        public static readonly CarbonDirectory ContentDirectory = new CarbonDirectory("www");
    }
}
