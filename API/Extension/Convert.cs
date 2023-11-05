using System.Diagnostics;
namespace GateWay.Extension
{
    public class ConvertExtension
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ConvertExtension(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public void ConvertToPDF(string inputFilePath, string outputPath)
        {

            try
            {
                ProcessStartInfo startInfo = new ProcessStartInfo();
                // startInfo.FileName = "/Applications/LibreOffice.app/Contents/MacOS/soffice"; // Provide the correct path
                startInfo.FileName = "/usr/bin/soffice"; // Provide the correct path for linux
                startInfo.Arguments = $"--headless --convert-to pdf --outdir \"{outputPath}\" \"{inputFilePath}\"";
                startInfo.WindowStyle = ProcessWindowStyle.Hidden;
                startInfo.CreateNoWindow = true;
                //RedirectStandardOutput = true, // Add this line to capture the command output
                //RedirectStandardError = true

                //ProcessStartInfo startInfo = new ProcessStartInfo
                //{
                //    FileName = "soffice", // Use the correct executable name
                //    Arguments = $"--headless --convert-to pdf --outdir \"{outputPath}\" \"{inputFilePath}\"",
                //    WindowStyle = ProcessWindowStyle.Hidden,
                //    CreateNoWindow = true,
                //    RedirectStandardOutput = true, // Add this line to capture the command output
                //    RedirectStandardError = true   // Add this line to capture the error output
                //};

                using (Process process = new Process())
                {
                    process.StartInfo = startInfo;
                    process.Start();
                    process.WaitForExit();

                    string commandOutput = process.StandardOutput.ReadToEnd();
                    string errorOutput = process.StandardError.ReadToEnd();

                    if (process.ExitCode == 0)
                    {
                        Console.WriteLine("Conversion complete.");
                        Console.WriteLine("Command Output: " + commandOutput);
                    }
                    else
                    {
                        Console.WriteLine("Conversion failed.");
                        Console.WriteLine("Error Output: " + errorOutput);
                        throw new InvalidOperationException("Conversion failed.");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
        }
    }
}