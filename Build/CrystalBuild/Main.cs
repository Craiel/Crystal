namespace CrystalBuild
{
    using CarbonCore.Utils.Contracts.IoC;
    using CarbonCore.UtilsCommandLine.Contracts;

    using CrystalBuild.Contracts;

    public class Main : IMain
    {
        private readonly ICommandLineArguments arguments;
        
        // -------------------------------------------------------------------
        // Constructor
        // -------------------------------------------------------------------
        public Main(IFactory factory)
        {
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
        }

        // -------------------------------------------------------------------
        // Private
        // -------------------------------------------------------------------
        private void DoBuildProject()
        {
        }
        
        private void RegisterCommandLineArguments()
        {
            // -I Partials -I Overrides -o ..\..\..\..\Source -p ..\..\..\..\SharpMC.jtlproj
            //ICommandLineSwitchDefinition definition = this.arguments.Define("p", "projectFile", x => this.projectFileName = new CarbonFile(x));
            //definition.RequireArgument = true;
            //definition.Description = "The project file to compile";
            
        }
    }
}
