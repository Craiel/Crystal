namespace CrystalBuild.Contracts
{
    using System.Collections.Generic;

    using CarbonCore.Utils.IO;

    public interface IBuildLogic
    {
        void Build(IList<CarbonFile> sources, CarbonFile target);
        void BuildTemplates(IList<CarbonFile> sources, CarbonFile target);
        void BuildData(IList<CarbonFile> sources, CarbonFile target);
    }
}
