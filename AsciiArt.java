import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;

public class AsciiArt {
    static final String ASCII = "@%#*+=-:. ";

    public static void main(String[] args) throws Exception {
        BufferedImage img = ImageIO.read(new File("image.jpg")); // Change filename

        int width = 100;
        int height = img.getHeight() * width / img.getWidth() / 2;

        Image scaled = img.getScaledInstance(width, height, Image.SCALE_SMOOTH);
        BufferedImage out = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = out.createGraphics();
        g.drawImage(scaled, 0, 0, null);
        g.dispose();

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                Color c = new Color(out.getRGB(x, y));
                int gray = (c.getRed() + c.getGreen() + c.getBlue()) / 3;
                int index = gray * (ASCII.length() - 1) / 255;
                System.out.print(ASCII.charAt(index));
            }
            System.out.println();
        }
    }
}