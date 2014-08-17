namespace CrystalBuild.Logic
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Text;
    using System.Text.RegularExpressions;

    using CarbonCore.Utils;
    using CarbonCore.Utils.IO;

    using CrystalBuild.Contracts;

    public class BuildLogic : IBuildLogic
    {
        private static readonly char[] StripFromTemplates = new[] { '\n', '\r', '\t' };
        
        // -------------------------------------------------------------------
        // Public
        // -------------------------------------------------------------------
        public void Build(IList<CarbonFileResult> sources, CarbonFile target)
        {
            System.Diagnostics.Trace.TraceInformation("Building {0} Sources into {1}", sources.Count, target);

            var builder = new StringBuilder();
            foreach (CarbonFileResult source in sources)
            {
                string content = source.Absolute.ReadAsString();

                this.ProcessSource(ref content);

                builder.AppendLine("// {0}", source.Relative.ToString());
                builder.Append(content);
                builder.AppendLine();
            }

            target.GetDirectory().Create();
            using (FileStream stream = target.OpenCreate())
            {
                using (var writer = new StreamWriter(stream))
                {
                    writer.Write(builder.ToString());
                }
            }
        }

        public void BuildTemplates(IList<CarbonFileResult> sources, CarbonFile target)
        {
            System.Diagnostics.Trace.TraceInformation("Building {0} Templates into {1}", sources.Count, target);

            var builder = new StringBuilder();

            builder.AppendLine(string.Format(CrystalBuild.Constants.JsonBuildPrefix, "TemplateContent"));
            foreach (CarbonFileResult file in sources)
            {
                string content = file.Absolute.ReadAsString();
                string[] segments = content.Split(StripFromTemplates, StringSplitOptions.RemoveEmptyEntries);
                content = string.Join(" ", segments);
                builder.AppendLine("\t{0}: '{1}',", file.Absolute.FileNameWithoutExtension, content);
            }

            builder.AppendLine(CrystalBuild.Constants.JsonBuildPostfix);

            target.GetDirectory().Create();
            using (FileStream stream = target.OpenCreate())
            {
                using (var writer = new StreamWriter(stream))
                {
                    writer.Write(builder.ToString());
                }
            }
        }

        public void BuildData(IList<CarbonFileResult> sources, CarbonFile target)
        {
            System.Diagnostics.Trace.TraceInformation("Building {0} Data into {1}", sources.Count, target);

            System.Diagnostics.Trace.TraceError("Not implemented!");
        }

        public void BuildStyleSheets(IList<CarbonFileResult> sources, CarbonFile target)
        {
            System.Diagnostics.Trace.TraceInformation("Building {0} Stylesheets into {1}", sources.Count, target);

            var builder = new StringBuilder();
            foreach (CarbonFileResult file in sources)
            {
                string content = file.Absolute.ReadAsString();
                builder.Append(content);
                builder.AppendLine();
            }

            target.GetDirectory().Create();
            using (FileStream stream = target.OpenCreate())
            {
                using (var writer = new StreamWriter(stream))
                {
                    writer.Write(builder.ToString());
                }
            }
        }

        public void CopyContents(IList<CarbonFileResult> sources, CarbonDirectory target)
        {
            System.Diagnostics.Trace.TraceInformation("Copying {0} Content into {1}", sources.Count, target);

            foreach (CarbonFileResult source in sources)
            {
                source.Absolute.CopyTo(target.ToFile(source.Relative), true);
            }
        }

        private void ProcessSource(ref string source)
        {
            string[] lines = source.Split('\n');
            var trimmedContent = new StringBuilder(lines.Length);
            for (int i = 0; i < lines.Length; i++)
            {
                string line = lines[i];
                if (line.TrimStart().StartsWith(@"//"))
                {
                    continue;
                }

                // Replace some things we don't care about
                line = line.Replace("\r", string.Empty);
                line = line.Replace("\t", " ");

                // Fix includes to the proper format
                Match match = CrystalBuild.Constants.IncludeRegex.Match(line);
                if (match.Success)
                {
                    string entry = match.Groups[1].ToString();
                    string name = match.Groups[2].ToString();
                    string varName = string.Concat(char.ToLower(name[1]), name.Substring(2, name.Length - 3));
                    line = line.Replace(entry, string.Format("var {0} = {1}", varName, entry));
                }

                trimmedContent.AppendLine(line);
            }

            source = trimmedContent.ToString();
        }
    }
}
