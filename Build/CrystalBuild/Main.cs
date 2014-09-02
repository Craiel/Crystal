﻿namespace CrystalBuild
{
    using System.Collections.Generic;
    using System.Diagnostics;

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

        private bool useDebug;
        private bool useClosure;

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
                    Trace.TraceWarning("No data found to build!");
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
                    Trace.TraceWarning("No templates found to build!");
                }
            }

            if (this.config.Current.Sources != null)
            {
                IList<CarbonDirectoryFilter> filters = this.config.Current.Sources;
                IList<CarbonFileResult> files = CarbonDirectory.GetFiles(filters);
                if (files.Count > 0)
                {
                    CarbonFile targetFile = this.config.Current.ProjectRoot.ToFile(this.config.Current.SourceTarget);
                    CarbonFile targetFileClosure = targetFile;
                    if (this.useClosure)
                    {
                        targetFile = targetFile.GetDirectory().ToFile(targetFile.FileNameWithoutExtension + "_raw.js");
                    }

                    this.logic.Build(files, targetFile, this.useDebug);

                    if (this.useClosure)
                    {
                        var info = new ProcessStartInfo("java.exe", string.Format(Constants.ClosureCompilerCommand, RuntimeInfo.Assembly.GetDirectory().ToRelative<CarbonDirectory>(RuntimeInfo.WorkingDirectory), targetFile, targetFileClosure, RuntimeInfo.WorkingDirectory.ToFile("externs.js")))
                                       {
                                           UseShellExecute = false,
                                           WorkingDirectory = RuntimeInfo.WorkingDirectory.ToString()
                                       };
                        var proc = Process.Start(info);
                        proc.WaitForExit();
                    }
                }
                else
                {
                    Trace.TraceWarning("No source files found to build!");
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
                    Trace.TraceWarning("No templates found to build!");
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
                    Trace.TraceWarning("No content files found to copy!");
                }
            }
        }
        
        private void RegisterCommandLineArguments()
        {
            ICommandLineSwitchDefinition definition = this.arguments.Define("p", "projectFile", x => this.configFileName = new CarbonFile(x));
            definition.RequireArgument = true;
            definition.Description = "The project file to compile";

            definition = this.arguments.Define("d", "debug", x => this.useDebug = true);
            definition.Description = "Build with debug info enabled";

            definition = this.arguments.Define("c", "closure", x => this.useClosure = true);
            definition.Description = "Run closure on the target script file";
        }
    }
}
