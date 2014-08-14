namespace CrystalBuild.IoC
{
    using CarbonCore.Utils.IoC;
    using CarbonCore.UtilsCommandLine.IoC;

    using CrystalBuild.Contracts;

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
        }
    }
}