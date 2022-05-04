using System;
using System.IO.Ports;

namespace wire_reelcutter
{
    class Program
    {
        static void Main(string[] args)
        {
            string com = "";
            Console.WriteLine("What port is your mbed connected to?");
            com = Console.ReadLine();
            SerialPort serialPort = new SerialPort("COM"+com, 9600, Parity.None, 8, StopBits.One);
            serialPort.Open();
            Console.WriteLine("open");
            char[] buffer = new char[27];
            string confirmation = "n";
            while (confirmation == "n" || confirmation == "N")
            {
                string cutter = "";
                while (!(cutter == "w" || cutter == "W" || cutter == "r" || cutter == "R"))
                {
                    Console.WriteLine("Do you want to use the reelcutter or wirecutter?");
                    Console.WriteLine("Type W for wirecutter");
                    Console.WriteLine("Type R for reelcutter");
                    cutter = Console.ReadLine();
                }
                if (cutter == "W" || cutter == "w")
                {
                    Console.Write("What length of the first part needs to be stripped? (between 0-255 mm) ");
                    int leftStripped = Math.Max(Math.Min(Convert.ToInt32(Console.ReadLine()), 255),0);
                    Console.Write("What length of the second part needs to be stripped? (between 0-255 mm) ");
                    int rightStripped = Math.Max(Math.Min(Convert.ToInt32(Console.ReadLine()), 255), 0);
                    Console.Write("What's the middle length of the wire? (between 0-1000 mm) ");
                    int middleLength = Math.Max(Math.Min(Convert.ToInt32(Console.ReadLine()), 1000), 0);
                    Console.Write("What amount of wires need to be stripped? (between 0-255) ");
                    int amount = Math.Max(Math.Min(Convert.ToInt32(Console.ReadLine()), 255), 0);
                    Console.WriteLine($"First side is stripped {leftStripped} mm.");
                    Console.WriteLine($"Second side is stripped {rightStripped} mm.");
                    Console.WriteLine($"The wire has a middle length of {middleLength} mm.");
                    Console.WriteLine($"There are a total of {amount} wires to be cut");
                    Console.WriteLine("Is this what you wanted? [Y/n]");
                    confirmation = Console.ReadLine();
                    if (confirmation == "Y" || confirmation == "y" || confirmation == "")
                    {
                        serialPort.Write($"{leftStripped},{rightStripped},{middleLength},{amount},0000000\r\n");
                        serialPort.Read(buffer, 0, 26);
                        Console.WriteLine("received");
                        Console.WriteLine(buffer);
                    }
                }
                else if (cutter == "R" || cutter == "r")
                {
                    int reelnumber = 0;
                    while (!(reelnumber == 1 || reelnumber == 2 || reelnumber == 3 || reelnumber == 4))
                    {
                        Console.WriteLine("What size will you use? ");
                        Console.WriteLine("Enter '1' for 0402 ");
                        Console.WriteLine("Enter '2' for 0603 ");
                        Console.WriteLine("Enter '3' for 0805 ");
                        Console.WriteLine("Enter '4' for 1206 ");
                        reelnumber = Convert.ToInt32(Console.ReadLine());
                    }
                    if (reelnumber == 1 || reelnumber == 2 || reelnumber == 3 || reelnumber == 4)
                    {
                        Console.Write("How many components do you want per reel? ");
                        int numberOfComponents = Math.Max(Math.Min(Convert.ToInt32(Console.ReadLine()), 255), 0);
                        Console.Write("How many reels do you want? ");
                        int numberOfReels = Math.Max(Math.Min(Convert.ToInt32(Console.ReadLine()), 255), 0);

                        Console.WriteLine("received");
                        Console.WriteLine(buffer);
                        Console.WriteLine($"There are a total of {numberOfComponents} components per reel.");
                        Console.WriteLine($"There are a total of {numberOfReels} reels to be cut.");
                        Console.WriteLine("Is this what you wanted? [Y/n]");
                        confirmation = Console.ReadLine();
                        if (confirmation == "Y" || confirmation == "y" || confirmation == "")
                        {
                            serialPort.Write($"00000000000000,{reelnumber},{numberOfComponents},{numberOfReels}");
                            serialPort.Read(buffer, 0, 26);
                            Console.WriteLine("received");
                            Console.WriteLine(buffer);
                        }
                    }
                    
                }

            else
            {
                Console.WriteLine("That is not an option...");
            }
            }
        }
        }
    }

