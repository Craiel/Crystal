namespace CrystalBuild.Logic
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.IO;
    using System.Text;

    using CarbonCore.Utils;
    using CarbonCore.Utils.I18N;
    using CarbonCore.Utils.IO;

    using CrystalBuild.Contracts;
    
    using NPOI.SS.UserModel;
    using NPOI.XSSF.UserModel;

    using Constants = CrystalBuild.Constants;
    using Match = System.Text.RegularExpressions.Match;
    
    public class BuildLogic : IBuildLogic
    {
        private static readonly char[] StripFromTemplates = { '\n', '\r', '\t' };

        private static readonly IDictionary<string, string> HashCollisionTest = new Dictionary<string, string>();
        
        // -------------------------------------------------------------------
        // Public
        // -------------------------------------------------------------------
        public void Build(IList<CarbonFileResult> sources, CarbonFile target, bool isDebug = false)
        {
            System.Diagnostics.Trace.TraceInformation("Building {0} Sources into {1}", sources.Count, target);

            var builder = new StringBuilder();
            foreach (CarbonFileResult source in sources)
            {
                string content = source.Absolute.ReadAsString();

                this.ProcessSource(source.Absolute.FileNameWithoutExtension, ref content, isDebug);

                // In debug mode append the file name of the source
                if (isDebug)
                {
                    builder.AppendLine("// {0}", source.Relative.ToString());
                }

                builder.Append(content);
                builder.AppendLine();
            }

            target.GetDirectory().Create();
            using (FileStream stream = target.OpenCreate())
            {
                using (var writer = new StreamWriter(stream, Encoding.UTF8, 4096, true))
                {
                    writer.Write(builder.ToString());
                }
            }
        }

        public void BuildTemplates(IList<CarbonFileResult> sources, CarbonFile target)
        {
            System.Diagnostics.Trace.TraceInformation("Building {0} Templates into {1}", sources.Count, target);

            var builder = new StringBuilder();

            builder.AppendLine(string.Format(Constants.JsonBuildPrefix, "TemplateContent"));
            for (int i = 0; i < sources.Count; i++)
            {
                CarbonFileResult file = sources[i];
                string content = file.Absolute.ReadAsString();
                string[] segments = content.Split(StripFromTemplates, StringSplitOptions.RemoveEmptyEntries);
                content = string.Join(" ", segments);
                string delimiter = i < sources.Count - 1 ? "," : string.Empty;
                builder.AppendLine("\t{0}: '{1}'{2}", file.Absolute.FileNameWithoutExtension, content, delimiter);
            }

            builder.AppendLine(Constants.JsonBuildPostfix);

            target.GetDirectory().Create();
            using (FileStream stream = target.OpenCreate())
            {
                using (var writer = new StreamWriter(stream, Encoding.UTF8, 4096, true))
                {
                    writer.Write(builder.ToString());
                }
            }
        }

        public void BuildData(IList<CarbonFileResult> sources, CarbonFile target)
        {
            System.Diagnostics.Trace.TraceInformation("Building {0} Data into {1}", sources.Count, target);

            IList<string> sectionDuplicateCheck = new List<string>();
            var builder = new StringBuilder();
            builder.AppendLine(@"declare(""Data"", function() { return {");
            foreach (CarbonFileResult file in sources)
            {
                System.Diagnostics.Trace.TraceInformation("  {0}", file.Absolute.FileName);
                using (FileStream stream = file.Absolute.OpenRead())
                {
                    var workBook = new XSSFWorkbook(stream);
                    System.Diagnostics.Trace.TraceInformation("  - {0} Sheet(s)", workBook.NumberOfSheets);
                    for(var i = 0; i < workBook.NumberOfSheets; i++)
                    {
                        ISheet sheet = workBook.GetSheetAt(i);
                        if (sheet.PhysicalNumberOfRows <= 1)
                        {
                            System.Diagnostics.Trace.TraceWarning("Sheet has insufficient rows!");
                            continue;
                        }

                        if (sectionDuplicateCheck.Contains(sheet.SheetName))
                        {
                            System.Diagnostics.Trace.TraceWarning("Skipping Duplicate sheet name: {0} in {1}", sheet.SheetName, file.Absolute.FileName);
                            continue;
                        }

                        builder.AppendLine("    {0}: {{", sheet.SheetName);
                        this.BuildDataEntrySection(sheet, "        ", builder);
                        builder.AppendLine(@"    },");
                        sectionDuplicateCheck.Add(sheet.SheetName);
                    }
                }
            }

            builder.AppendLine(@"}; });");

            using (var stream = target.OpenCreate())
            {
                using (var writer = new StreamWriter(stream, Encoding.UTF8, 4096, true))
                {
                    writer.Write(builder.ToString());
                }
            }

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
                using (var writer = new StreamWriter(stream, Encoding.UTF8, 4096, true))
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

        // -------------------------------------------------------------------
        // Private
        // -------------------------------------------------------------------
        private void ProcessSource(string sourceName, ref string source, bool isDebug)
        {
            var processingDirectiveStack = new Stack<Constants.ProcessingInstructions>();

            string[] lines = source.Split('\n');
            var trimmedContent = new StringBuilder(lines.Length);
            for (int i = 0; i < lines.Length; i++)
            {
                string line = lines[i];
                string trimmed = line.TrimStart();
                if (trimmed.StartsWith(@"//"))
                {
                    if (trimmed.StartsWith("// #EndIf", StringComparison.OrdinalIgnoreCase))
                    {
                        processingDirectiveStack.Pop();
                    } 
                    else if (Constants.ProcessingRegex.IsMatch(trimmed))
                    {
                        string instructionString = Constants.ProcessingRegex.Match(trimmed).Groups[1].ToString();
                        Constants.ProcessingInstructions instruction;
                        if (Enum.TryParse(instructionString, out instruction))
                        {
                            processingDirectiveStack.Push(instruction);
                        }
                        else
                        {
                            System.Diagnostics.Trace.TraceWarning("Unknown processing instruction: {0} on line {1}", instructionString, i);
                        }
                    }

                    continue;
                }

                if (processingDirectiveStack.Contains(Constants.ProcessingInstructions.Debug) && !isDebug)
                {
                    continue;
                }

                // Replace some things we don't care about
                line = line.Replace("\r", string.Empty);
                line = line.Replace("\t", " ");

                // Fix includes to the proper format
                Match match = Constants.IncludeRegex.Match(line);
                if (match.Success)
                {
                    string entry = match.Groups[1].ToString();
                    string name = match.Groups[2].ToString();
                    string varName = string.Concat(char.ToLower(name[1]), name.Substring(2, name.Length - 3));
                    line = line.Replace(entry, string.Format("var {0} = {1}", varName, entry));
                    line = line.Replace(name, string.Format("{0},'{1}'", name, sourceName));
                }

                // Replace StrLoc() with plain localized string
                match = Constants.StringLocRegex.Match(line);
                if (match.Success)
                {
                    string localized = match.Groups[2].ToString().Localized();
                    line = line.Replace(match.Groups[1].ToString(), string.Format("\"{0}\"", localized));
                }

                // Replace StrSha() with hash value of the string
                match = Constants.StringHashRegex.Match(line);
                if (match.Success)
                {
                    string expression = match.Groups[1].ToString();
                    string content = match.Groups[2].ToString();
                    string hash = HashFileName.GetHashFileName(content).Value;
                    if (HashCollisionTest.ContainsKey(hash))
                    {
                        // If the contents do not match we have a hash collision
                        if (!string.Equals(HashCollisionTest[hash], content))
                        {
                            System.Diagnostics.Trace.TraceWarning(
                                "Hash Collision for {0}, \"{1}\" <-> \"{2}\"",
                                hash,
                                HashCollisionTest[hash],
                                content);
                        }
                    }
                    else
                    {
                        HashCollisionTest.Add(hash, content);
                    }

                    // Todo: need to actually hash the string with something like .Obfuscate(Constants.ObfuscationValue))
                    line = line.Replace(expression, string.Format("\"{0}\"", hash));
                }

                trimmedContent.AppendLine(line);
            }

            source = trimmedContent.ToString();
        }

        private void BuildDataEntrySection(ISheet sheet, string delimiter, StringBuilder target)
        {
            // Get the row enum
            IEnumerator rowEnum = sheet.GetRowEnumerator();

            // Read the headers
            rowEnum.MoveNext();
            var row = (XSSFRow)rowEnum.Current;
            IList<string> headers = new List<string>();
            IEnumerator cellEnum = row.CellIterator();
            while (cellEnum.MoveNext())
            {
                headers.Add(cellEnum.Current.ToString());
            }

            // Read the data
            int dataIndex = 0;
            while (rowEnum.MoveNext())
            {
                target.AppendLine("{0}{1}: {{", delimiter, dataIndex++);
                row = (XSSFRow)rowEnum.Current;
                cellEnum = row.CellIterator();
                while (cellEnum.MoveNext())
                {
                    var cellData = (XSSFCell)cellEnum.Current;
                    target.AppendLine("{0}    {1}: {2},", delimiter, headers[cellData.ColumnIndex], this.BuildDataEntryValue(cellData.ToString()));
                }

                target.AppendLine("{0}}},", delimiter);
            }
        }

        private string BuildDataEntryValue(string source)
        {
            int intResult;
            if (int.TryParse(source, out intResult))
            {
                return source;
            }

            bool boolResult;
            if (bool.TryParse(source.ToLowerInvariant(), out boolResult))
            {
                return source.ToLowerInvariant();
            }

            float floatResult;
            if (float.TryParse(source, out floatResult))
            {
                return source.Replace(",", ".");
            }

            return string.Format(@"""{0}""", source);
        }
    }
}
