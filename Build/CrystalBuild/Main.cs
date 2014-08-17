namespace CrystalBuild
{
    using System.Collections.Generic;
    using System.IO;

    using CarbonCore.Utils;
    using CarbonCore.Utils.Contracts.IoC;
    using CarbonCore.Utils.IO;
    using CarbonCore.UtilsCommandLine.Contracts;

    using CrystalBuild.Contracts;

    public class Main : IMain
    {
        private readonly ICommandLineArguments arguments;
        private readonly IConfig config;
        private readonly IBuildLogic logic;

        private CarbonFile configFileName;

        // -------------------------------------------------------------------
        // Constructor
        // -------------------------------------------------------------------
        public Main(IFactory factory)
        {
            this.config = factory.Resolve<IConfig>();
            this.logic = factory.Resolve<IBuildLogic>();

            this.arguments = factory.Resolve<ICommandLineArguments>();
            this.RegisterCommandLineArguments();
        }

        // -------------------------------------------------------------------
        // Public
        // -------------------------------------------------------------------
        public void Build()
        {
            if (!this.arguments.ParseCommandLineArguments())
            {
                this.arguments.PrintArgumentUse();
                return;
            }

            if (this.configFileName != null)
            {
                this.config.Load(this.configFileName);
                this.DoBuildProject();
            }
        }

        // -------------------------------------------------------------------
        // Private
        // -------------------------------------------------------------------
        private void DoBuildProject()
        {
            if (this.config.Current.Data != null)
            {
                IList<CarbonDirectoryFilter> filters = this.config.Current.Data;
                IList<CarbonFileResult> files = CarbonDirectory.GetFiles(filters);
                if (files != null && files.Count > 0)
                {
                    this.logic.BuildData(files, this.config.Current.ProjectRoot.ToFile(this.config.Current.DataTarget));
                }
                else
                {
                    System.Diagnostics.Trace.TraceWarning("No data found to build!");
                }
            }

            if (this.config.Current.Templates != null)
            {
                IList<CarbonDirectoryFilter> filters = this.config.Current.Templates;
                IList<CarbonFileResult> files = CarbonDirectory.GetFiles(filters);
                if (files != null && files.Count > 0)
                {
                    this.logic.BuildTemplates(files, this.config.Current.ProjectRoot.ToFile(this.config.Current.TemplateTarget));
                }
                else
                {
                    System.Diagnostics.Trace.TraceWarning("No templates found to build!");
                }
            }

            if (this.config.Current.Sources != null)
            {
                IList<CarbonDirectoryFilter> filters = this.config.Current.Sources;
                IList<CarbonFileResult> files = CarbonDirectory.GetFiles(filters);
                if (files.Count > 0)
                {
                    this.logic.Build(files, this.config.Current.ProjectRoot.ToFile(this.config.Current.SourceTarget));
                }
                else
                {
                    System.Diagnostics.Trace.TraceWarning("No source files found to build!");
                }
            }

            if (this.config.Current.StyleSheets != null)
            {
                IList<CarbonDirectoryFilter> filters = this.config.Current.StyleSheets;
                IList<CarbonFileResult> files = CarbonDirectory.GetFiles(filters);
                if (files != null && files.Count > 0)
                {
                    this.logic.BuildStyleSheets(files, this.config.Current.ProjectRoot.ToFile(this.config.Current.StyleSheetTarget));
                }
                else
                {
                    System.Diagnostics.Trace.TraceWarning("No templates found to build!");
                }
            }

            if (this.config.Current.Contents != null)
            {
                IList<CarbonDirectoryFilter> filters = this.config.Current.Contents;
                IList<CarbonFileResult> files = CarbonDirectory.GetFiles(filters);
                if (files.Count > 0)
                {
                    this.logic.CopyContents(files, this.config.Current.ProjectRoot.ToDirectory(this.config.Current.ContentTarget));
                }
                else
                {
                    System.Diagnostics.Trace.TraceWarning("No content files found to copy!");
                }
            }
        }
        
        private void RegisterCommandLineArguments()
        {
            ICommandLineSwitchDefinition definition = this.arguments.Define("p", "projectFile", x => this.configFileName = new CarbonFile(x));
            definition.RequireArgument = true;
            definition.Description = "The project file to compile";
        }
    }
}
