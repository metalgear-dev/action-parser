import MagicEdenParser from './controllers/magiceden';

const magicedenParser = new MagicEdenParser();

const signature =
    '4odJfW2MzLxchcJgCW5e8DqF8ZGqyc6QvZ4JZ6r572LLUaGdZsKyKs5E58o9NiRaHMnuMDCFZbCs8XxweEobtKq9';
magicedenParser.parse(signature);
