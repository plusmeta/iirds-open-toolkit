import fs from "fs";

import Helvetica from "!!raw-loader!pdfkit/js/data/Helvetica.afm";
import PingFang from "!!arraybuffer-loader!../assets/fonts/PingFang-SC-Regular.ttf";
import PingFangBold from "!!arraybuffer-loader!../assets/fonts/PingFang-SC-Bold.ttf";
import Ubuntu from "!!arraybuffer-loader!../assets/fonts/Ubuntu-Regular.ttf";
import UbuntuBold from "!!arraybuffer-loader!../assets/fonts/Ubuntu-Bold.ttf";
import PlusmetaLogo from "!!arraybuffer-loader!../assets/images/icon.png";

const paths = {
    fonts: {
        "Helvetica": "data/Helvetica.afm",
        "Ubuntu": "Ubuntu",
        "UbuntuBold": "Ubuntu-Bold",
        "PingFang": "PingFang",
        "PingFangBold": "PingFang-Bold"
    },
    image: {
        "PlusmetaLogo": "data/logo.png"
    }
};

fs.writeFileSync(paths.fonts.Helvetica, Helvetica);
fs.writeFileSync(paths.fonts.Ubuntu, Ubuntu);
fs.writeFileSync(paths.fonts.UbuntuBold, UbuntuBold);
fs.writeFileSync(paths.fonts.PingFang, PingFang);
fs.writeFileSync(paths.fonts.PingFangBold, PingFangBold);
fs.writeFileSync(paths.image.PlusmetaLogo, PlusmetaLogo);

export default paths;
