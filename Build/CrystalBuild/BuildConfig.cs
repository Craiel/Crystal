namespace CrystalBuild
{
    using CarbonCore.Utils.IO;

    using Newtonsoft.Json;

    [JsonObject(MemberSerialization.OptOut)]
    public class BuildConfig
    {
        [JsonIgnore]
        public CarbonDirectory ProjectRoot { get; set; }

        public string Name { get; set; }

        public CarbonDirectory[] Data { get; set; }
        public CarbonDirectory[] Templates { get; set; }
        public CarbonDirectory[] Sources { get; set; }

        public CarbonFile SourceTarget { get; set; }
        public CarbonFile TemplateTarget { get; set; }
        public CarbonFile DataTarget { get; set; }
    }
}
