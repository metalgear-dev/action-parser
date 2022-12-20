import MagicEdenParser from './controllers/magiceden';

const magicedenParser = new MagicEdenParser();

const signature =
    '2GM65Hs5DYnRuHJWdzHTsHhPkbUWzF9vNwFJpzbmvfeSR7JANSW3KNeQv4z2BCDKrxp872cyMeVPu8MFR1EwkACN';
magicedenParser.parse(signature);
