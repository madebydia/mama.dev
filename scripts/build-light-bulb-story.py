#!/usr/bin/env python3
"""Build the one-page color PDF for the light-bulb true story."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE_IMAGE = ROOT / "legacy-pages/assets/images/edison-carbon-lamp-smithsonian.jpg"
OUTPUT_PDF = ROOT / "legacy-pages/one-true-story/stories/the-invention-of-the-light-bulb.pdf"

W, H = 2550, 3300
INK = "#17263B"
CREAM = "#FBF5E8"
GOLD = "#E8B94F"
PALE_GOLD = "#F6E6B5"
CORAL = "#D96C58"
TEAL = "#367E7A"
PALE_TEAL = "#DCEBE6"
WHITE = "#FFFFFF"
MUTED = "#5E6571"

FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_ITALIC = "/System/Library/Fonts/Supplemental/Arial Italic.ttf"


def font(size, bold=False, italic=False):
    path = FONT_BOLD if bold else FONT_ITALIC if italic else FONT_REGULAR
    return ImageFont.truetype(path, size=size)


def wrap(draw, text, face, width):
    words = text.split()
    lines, line = [], ""
    for word in words:
        trial = word if not line else f"{line} {word}"
        if draw.textlength(trial, font=face) <= width:
            line = trial
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def paragraph(draw, xy, text, face, width, fill=INK, leading=1.25):
    x, y = xy
    line_height = int(face.size * leading)
    for line in wrap(draw, text, face, width):
        draw.text((x, y), line, font=face, fill=fill)
        y += line_height
    return y


def rounded_label(draw, xy, text, bg, fg=INK):
    x, y = xy
    face = font(35, bold=True)
    tw = int(draw.textlength(text, font=face))
    draw.rounded_rectangle((x, y, x + tw + 56, y + 70), radius=35, fill=bg)
    draw.text((x + 28, y + 15), text, font=face, fill=fg)


def story_paragraph(draw, x, y, width, text, first=False):
    if first:
        face = font(44, bold=True)
        line_height = int(face.size * 1.3)
        lines = wrap(draw, text, face, width)
        for line in lines:
            draw.text((x, y), line, font=face, fill=INK)
            y += line_height
    else:
        y = paragraph(draw, (x, y), text, font(38), width, fill=INK, leading=1.35)
    return y + 34


def main():
    page = Image.new("RGB", (W, H), CREAM)
    draw = ImageDraw.Draw(page)

    # Strong, colorful opening panel.
    draw.rectangle((0, 0, W, 870), fill=INK)
    draw.rectangle((0, 870, W, 895), fill=GOLD)
    draw.ellipse((-180, 610, 390, 855), fill=CORAL)
    rounded_label(draw, (145, 115), "ONE TRUE STORY", GOLD)
    draw.text((145, 245), "THE INVENTION", font=font(104, bold=True), fill=WHITE)
    draw.text((145, 360), "OF THE LIGHT BULB", font=font(104, bold=True), fill=WHITE)
    paragraph(
        draw,
        (150, 520),
        "Many inventors helped turn a glowing experiment into light for homes.",
        font(46),
        1310,
        fill="#E8EDF3",
        leading=1.25,
    )

    # Smithsonian object photo.
    card = (1690, 90, 2395, 1035)
    draw.rounded_rectangle(card, radius=28, fill=WHITE)
    bulb = Image.open(SOURCE_IMAGE).convert("RGB")
    bulb.thumbnail((610, 790), Image.Resampling.LANCZOS)
    bx = card[0] + (card[2] - card[0] - bulb.width) // 2
    by = card[1] + 44
    page.paste(bulb, (bx, by))
    draw.text((1735, 918), "EDISON CARBON-FILAMENT LAMP", font=font(25, bold=True), fill=INK)
    draw.text((1735, 955), "c. 1880 · Smithsonian (CC0)", font=font(25), fill=MUTED)

    # A continuous read-aloud story, set like a magazine rather than a fact sheet.
    left_x, right_x, col_w = 150, 1315, 1085
    left_y = 1040
    left_y = story_paragraph(
        draw, left_x, left_y, col_w,
        "On a winter evening in 1879, a glass bulb began to glow at Menlo Park, New Jersey. Thomas Edison and the workers in his laboratory watched the tiny thread of light. They had been chasing that glow for more than a year.",
        first=True,
    )
    left_y = story_paragraph(
        draw, left_x, left_y, col_w,
        "They were not the first people to make electric light. Inventors had experimented with it for decades. In Britain, Joseph Swan was making a practical carbon lamp too, and he demonstrated his lamp in 1879.",
    )
    left_y = story_paragraph(
        draw, left_x, left_y, col_w,
        "At Menlo Park, Edison worked with a team nicknamed the muckers. They tried one material after another for the filament, the thin part that glows. Platinum, rubber and even soot were tested. Most attempts shone briefly, then went dark.",
    )

    draw.rounded_rectangle((left_x, left_y + 5, left_x + col_w, left_y + 390), radius=28, fill=PALE_GOLD)
    draw.text((left_x + 48, left_y + 45), "1,000 WAYS", font=font(34, bold=True), fill=CORAL)
    paragraph(
        draw,
        (left_x + 48, left_y + 105),
        "People later told the story this way: Edison had not failed 1,000 times. He had found 1,000 ways that did not work.",
        font(43, bold=True),
        col_w - 96,
        fill=INK,
        leading=1.27,
    )

    right_y = 1110
    right_y = story_paragraph(
        draw, right_x, right_y, col_w,
        "The exact number and wording are uncertain. But the real work was just as stubborn: hundreds of experiments and thousands of material tests. Each failure gave the team another clue about what to try next.",
        first=True,
    )
    right_y = story_paragraph(
        draw, right_x, right_y, col_w,
        "Then they tried a small cotton thread. They baked it until it became carbon, sealed it inside a glass bulb and pumped out the air. The filament glowed for at least 13 hours. At last, the light stayed on.",
    )
    right_y = story_paragraph(
        draw, right_x, right_y, col_w,
        "A working bulb was not enough. The team also needed generators, wires, switches, fuses, meters and sockets. They built a whole system so people could use electric light safely.",
    )
    right_y = story_paragraph(
        draw, right_x, right_y, col_w,
        "In 1882, Edison's Pearl Street station began sending power to customers in lower Manhattan. Rooms that had once been lit by candles or gas could glow with electric light.",
    )
    right_y = story_paragraph(
        draw, right_x, right_y, col_w,
        "The change did not happen overnight. Most families kept using candles and gas lamps for many years. But the glowing buildings at Menlo Park had shown that an electric-light system really could work.",
    )
    right_y = story_paragraph(
        draw, right_x, right_y, col_w,
        "So who invented the light bulb? There is no one-person answer. Swan, Edison, their teams and earlier experimenters all helped. The light bulb was not one sudden bright idea. It was a long chain of dim tries, careful notes, teamwork - and one glow that finally lasted.",
    )

    # Closing note and sourcing footer.
    draw.rounded_rectangle((150, 2740, 2400, 3095), radius=28, fill=PALE_TEAL)
    draw.text((200, 2790), "A SMALL BULB. A VERY BIG SYSTEM.", font=font(34, bold=True), fill=TEAL)
    paragraph(
        draw,
        (200, 2855),
        "Edison's practical light worked because the lamp and the power system were designed together.",
        font(34),
        2080,
        fill=INK,
        leading=1.28,
    )

    draw.text((150, 3200), "MAMA.DEV · READ · NOTICE · WONDER", font=font(27, bold=True), fill=INK)
    draw.text((1460, 3192), "SOURCES", font=font(24, bold=True), fill=TEAL)
    draw.multiline_text(
        (1600, 3188),
        "National Park Service, Edison NHS · Smithsonian NMAH · Science Museum Group",
        font=font(22),
        fill=MUTED,
        spacing=6,
    )

    OUTPUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    page.save(OUTPUT_PDF, "PDF", resolution=300.0, quality=95)
    print(OUTPUT_PDF)


if __name__ == "__main__":
    main()
