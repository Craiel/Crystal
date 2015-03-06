namespace CrystalBuild.Contracts.Processors
{
    public interface IJavaScriptProcessor : IContentProcessor
    {
        bool IsDebug { get; set; }
    }
}
