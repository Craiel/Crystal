namespace CrystalBuild
{
    using CarbonCore.Utils.IO;
    using CarbonCore.Utils.Json;

    using CrystalBuild.Contracts;

    public class Config : JsonConfig<BuildConfig>, IConfig
    {
        // -------------------------------------------------------------------
        // Public
        // -------------------------------------------------------------------
        public override bool Load(CarbonFile file)
        {
            bool result = base.Load(file);

            // Set the project root
            this.Current.ProjectRoot = file.GetDirectory();

            return result;
        }

        // -------------------------------------------------------------------
        // Protected
        // -------------------------------------------------------------------
        protected override BuildConfig GetDefault()
        {
            return new BuildConfig
                       {
                           Name = Constants.DefaultProjectName,
                           Templates = new[] { Constants.DataTemplateDirectory },
                           Sources = new[] { Constants.SourceDirectory },
                           Data = new[] { Constants.DataDirectory },
                           SourceTarget = Constants.OutputDirectory.ToFile(Constants.DefaultProjectTarget),
                           TemplateTarget = Constants.SourceDataGeneratedDirectory.ToFile(Constants.DefaultTemplateTarget),
                           DataTarget = Constants.SourceDataGeneratedDirectory.ToFile(Constants.DefaultDataTarget)
                       };
        }
    }
}
