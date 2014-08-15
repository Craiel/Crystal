namespace CrystalBuild
{
    using System;
    using System.Collections.Generic;
    using System.IO;

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
                // Todo: print usage
                return;
            }

            // Todo
            if (this.configFileName != null)
            {
                this.config.Load(this.configFileName);
                this.DoBuildProject();
            }
            else
            {
                this.arguments.PrintArgumentUse();
            }
        }

        // -------------------------------------------------------------------
        // Private
        // -------------------------------------------------------------------
        private void DoBuildProject()
        {
            if (this.config.Current.Data != null)
            {
                IList<CarbonDirectory> dataDirectories = CarbonDirectory.ReRootDirectories(this.config.Current.ProjectRoot, this.config.Current.Data);
                IList<CarbonFile> dataFiles = CarbonDirectory.GetFiles(dataDirectories, Constants.FilterData, SearchOption.AllDirectories);
                if (dataFiles != null && dataFiles.Count > 0)
                {
                    this.logic.BuildData(dataFiles, this.config.Current.ProjectRoot.ToFile(this.config.Current.DataTarget));
                }
                else
                {
                    System.Diagnostics.Trace.TraceWarning("No data found to build!");
                }
            }

            if (this.config.Current.Templates != null)
            {
                IList<CarbonDirectory> templateDirectories = CarbonDirectory.ReRootDirectories(this.config.Current.ProjectRoot, this.config.Current.Templates);
                IList<CarbonFile> templateFiles = CarbonDirectory.GetFiles(templateDirectories, Constants.FilterTemplates, SearchOption.AllDirectories);
                if (templateFiles != null && templateFiles.Count > 0)
                {
                    this.logic.BuildTemplates(templateFiles, this.config.Current.ProjectRoot.ToFile(this.config.Current.TemplateTarget));
                }
                else
                {
                    System.Diagnostics.Trace.TraceWarning("No templates found to build!");
                }
            }

            if (this.config.Current.Sources != null)
            {
                IList<CarbonDirectory> sourceDirectories = CarbonDirectory.ReRootDirectories(this.config.Current.ProjectRoot, this.config.Current.Sources);
                IList<CarbonFile> sourceFiles = CarbonDirectory.GetFiles(sourceDirectories, Constants.FilterSource, SearchOption.AllDirectories);
                if (sourceFiles != null && sourceFiles.Count > 0)
                {
                    this.logic.Build(sourceFiles, this.config.Current.ProjectRoot.ToFile(this.config.Current.SourceTarget));
                }
                else
                {
                    System.Diagnostics.Trace.TraceWarning("No source files found to build!");
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
