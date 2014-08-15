namespace CrystalBuild.Logic
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Text;

    using CarbonCore.Utils;
    using CarbonCore.Utils.IO;

    using CrystalBuild.Contracts;

    public class BuildLogic : IBuildLogic
    {
        private static readonly char[] StripFromTemplates = new[] { '\n', '\r', '\t' };

        // -------------------------------------------------------------------
        // Public
        // -------------------------------------------------------------------
        public void Build(IList<CarbonFile> sources, CarbonFile target)
        {
            System.Diagnostics.Trace.TraceInformation("Building {0} Sources into {1}", sources.Count, target);

            System.Diagnostics.Trace.TraceError("Not implemented!");
        }

        public void BuildTemplates(IList<CarbonFile> sources, CarbonFile target)
        {
            System.Diagnostics.Trace.TraceInformation("Building {0} Templates into {1}", sources.Count, target);

            var builder = new StringBuilder();

            builder.AppendLine(CrystalBuild.Constants.JsonBuildPrefix);
            foreach (CarbonFile file in sources)
            {
                string content = file.ReadAsString();
                string[] segments = content.Split(StripFromTemplates, StringSplitOptions.RemoveEmptyEntries);
                content = string.Join(" ", segments);
                builder.AppendLine("\t{0}: '{1}',", file.FileNameWithoutExtension, content);
            }

            builder.AppendLine(CrystalBuild.Constants.JsonBuildPostfix);

            using (FileStream stream = target.OpenCreate())
            {
                using (var writer = new StreamWriter(stream))
                {
                    writer.Write(builder.ToString());
                }
            }
        }

        public void BuildData(IList<CarbonFile> sources, CarbonFile target)
        {
            System.Diagnostics.Trace.TraceInformation("Building {0} Data into {1}", sources.Count, target);

            System.Diagnostics.Trace.TraceError("Not implemented!");
        }
    }
}
