namespace CrystalBuild.IoC
{
    using CarbonCore.Utils.IoC;
    using CarbonCore.UtilsCommandLine.IoC;

    using CrystalBuild.Contracts;
    using CrystalBuild.Logic;

    [DependsOnModule(typeof(UtilsModule))]
    [DependsOnModule(typeof(UtilsCommandLineModule))]
    public class CrystalBuildModule : CarbonModule
    {
        // -------------------------------------------------------------------
        // Public
        // -------------------------------------------------------------------
        public CrystalBuildModule()
        {
            this.For<IMain>().Use<Main>();
            this.For<IConfig>().Use<Config>();

            this.For<IBuildLogic>().Use<BuildLogic>();
        }
    }
}