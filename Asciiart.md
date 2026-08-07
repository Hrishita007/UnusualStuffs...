ASCII Art Generator (Java)

Overview

This project is a simple Java program that converts an image into ASCII art. It reads an image, scales it to a manageable size, converts each pixel to grayscale, and replaces the brightness of each pixel with a corresponding ASCII character.

The generated ASCII art is printed directly to the console.

---

Features

- Converts images into ASCII art.
- Uses only standard Java libraries (no external dependencies).
- Automatically scales the image while preserving its aspect ratio.
- Easy to customize by changing the output width or ASCII character set.

---

Requirements

- Java Development Kit (JDK) 8 or later

---

Project Structure

Project/
├── AsciiArt.java
└── image.jpg

---

How to Run

1. Save the files

Place "AsciiArt.java" and the image you want to convert ("image.jpg") in the same folder.

2. Compile

javac AsciiArt.java

3. Run

java AsciiArt

The ASCII art will be displayed in the terminal.

---

Using a Different Image

If your image has a different filename or format, update this line in the code:

BufferedImage img = ImageIO.read(new File("image.jpg"));

For example:

BufferedImage img = ImageIO.read(new File("cat.png"));

---

Customization

Change Output Size

Modify:

int width = 100;

- Smaller value → Faster output, less detail
- Larger value → More detail, larger output

Change ASCII Characters

Modify:

static final String ASCII = "@%#*+=-:. ";

Characters on the left represent darker pixels, while those on the right represent lighter pixels.

Example alternatives:

@#S%?*+;:,. 

or

█▓▒░ .

---

How It Works

1. Loads the input image.
2. Scales it while maintaining the aspect ratio.
3. Converts each pixel to grayscale.
4. Maps each grayscale value to an ASCII character based on brightness.
5. Prints the resulting ASCII art line by line.

---

Future Improvements

- Save the ASCII art to a ".txt" file.
- Support colored ASCII output using ANSI escape codes.
- Build a graphical interface with drag-and-drop support.
- Convert GIFs and videos into animated ASCII art.
- Support Unicode block characters for higher-quality output.

---

License

This project is free to use, modify, and distribute for educational and personal purposes.