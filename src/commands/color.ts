// import {
//   avatarURL,
//   DiscordApplicationCommandOptionTypes,
//   DiscordInteractionResponseTypes,
//   sendInteractionResponse,
//   snowflakeToBigint,
// } from "../../deps.ts";
// import { log } from "../utils/logger.ts";'
// the very first command when i'd started making bots. this means more than you'd think to me.
// -arczen
import { createCommand } from "../utils/helpers.ts";
import { colors } from "../../colors.ts";
import { RGBToHex, hexToRGB } from "../../util.ts";
import { Embed } from "../utils/Embed.ts";
createCommand({
  name: `color`,
  guildOnly: true,
  arguments: [
    {
      name: "arg1",
      type: "string",
      required: true,
      missing: (message) => {
        return message.reply({
          embeds: [
            {
              description: ":flushed: sorry dude but the first argument is required",
              color: colors.emojiYellow,
            },
          ],
        });
      },
    },
    {
      name: "arg2",
      type: "string",
      required: false,
    },
    {
      name: "arg3",
      type: "string",
      required: false,
    },
  ] as const,
  execute: function (message, args) {
    //serves as a catch embed
    const embed = new Embed().setColor("000000").setTitle("Something went terribly wrong... try again!").setTimestamp();

    // if arg1 has a comma and arg2 doesnt exist
    // i.e. t!color 255,255,255
    // this, for me, is incorrect rgb supplication.
    // handle and parse this
    if (args.arg1.includes(",") == true && !args.arg2) {
      const _irgbs1 = args.arg1.split(",");
      const _irgbsTitle = args.arg1.split(",").join(", ");
      // i hate "as unknown as number"
      const _irgbs2 = RGBToHex(
        _irgbs1[0] as unknown as number,
        _irgbs1[1] as unknown as number,
        _irgbs1[2] as unknown as number
      );
      // prettier keeps reformatting that to this AAAAAAAAAAAAA
      embed.setColor(_irgbs2).setTitle(_irgbsTitle).setDescription(_irgbs2);
      // this handles hex codes
    } else if (args.arg1.includes("#") == true /* && args.arg1.length == 7 */) {
      const _h1 = hexToRGB(args.arg1);
      if (_h1 == null) {
        return embed.setDescription("a null was encountered and Tundra needed to stop.");
      }
      const _h2 = _h1?.join(", ");
      embed.setColor(args.arg1).setTitle(args.arg1).setDescription(`${_h2}`);
      // i.e. t!color 255, 255, 255
      // notice the spaces... they're basically different args
    } else if (args.arg2 && args.arg3 && args.arg1.includes(",") == true && args.arg2.includes(",") == true) {
      const _forUseInFunction = (args.arg1 + args.arg2 + args.arg3).split(",");
      // if arg-3 has a comma, for no reason, remove it (for parsing, not for showing.)
      if (args.arg3.includes(",")) args.arg3 = args.arg3.replace(",", "");
      // fix rgb value overflows. If this is not in here, it'd default to 00, which I do not want. I want it to default to FF
      if (Number(args.arg1.replace(",", "")) > 255) args.arg1 = "255";
      if (Number(args.arg2.replace(",", "")) > 255) args.arg2 = "255";
      if (Number(args.arg3) > 255) args.arg3 = "255";
      const _crgbhex = RGBToHex(
        _forUseInFunction[0] as unknown as number,
        _forUseInFunction[1] as unknown as number,
        _forUseInFunction[2] as unknown as number
      );
      // embed desc
      const _crgb1 = _forUseInFunction.join(", ");
      embed.setColor(_crgbhex).setTitle(_crgbhex).setDescription(_crgb1);
    }
    return message.reply({ embed });
  },
});
