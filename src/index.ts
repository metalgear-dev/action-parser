import MagicEdenParser from './controllers/magiceden';
import { Activity } from './types/web3';

const magicedenParser = new MagicEdenParser();

const signatures = [
  '1SBmEALmiFY14RrNj4iFk5rvpH4CnxCoqxi9toxcqQF5oPyLDsZQJCodd956KcascJt92fHTprpE7WQ5mrYtssa',
  'mjKDz4d7ga7CusUrYrbM4iu3FtwT5izHAUq6RdRj3nfg5xuZjmKJsMX7qmQx1AxSVybUJ4rRDwpXApfUQ4ZywCQ',
  '28MXGCBRfkbqdcw6zGknjR8wQJ6QXUgCkveqzPiqLFEcZXiJCUCYcGkFgLBQNypzfD9qmNVbyVTB6pXbzndBcDgq',
  '2xL31nrZw2guKPGTdbx1dYRmCZ6y5deMttDQGSLJJyCaiuQrBVGjuYWxeChUmgGSJLRcqe3WBzyqjXRWYSYdh9QL',
];

const getActivities = async (): Promise<(Activity | null)[]> => {
  const activities = await Promise.all(
    signatures.map(async (signature) => await magicedenParser.parse(signature))
  );
  console.log(activities);
  return activities;
};

getActivities();
