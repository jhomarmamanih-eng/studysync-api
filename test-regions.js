const { execSync } = require('child_process');

const regions = [
  'sa-east-1',
  'us-east-1',
  'us-west-1',
  'us-west-2',
  'us-east-2',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'ap-southeast-1',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-south-1',
  'ca-central-1'
];

const project = 'suvklnbssmezwvmtysev';
const password = 'j24e.4D%40nC5BQES';

for (const region of regions) {
  const url = `postgresql://postgres.${project}:${password}@aws-0-${region}.pooler.supabase.com:5432/postgres`;
  console.log(`\nTesting region ${region}...`);
  try {
    execSync(`npx prisma db push`, {
      env: { ...process.env, DATABASE_URL: url },
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    console.log(`SUCCESS in region ${region}!!!`);
    console.log(`URL: ${url}`);
    process.exit(0);
  } catch (e) {
    const output = e.stderr || e.stdout || e.message;
    if (output.includes('P1000') || output.includes('Authentication failed') || output.includes('password authentication failed')) {
      console.log(`Region ${region} responded with auth error. It might be the correct region but wrong password!`);
    } else if (output.includes('P1001')) {
      // connection error
      console.log(`Region ${region} failed to connect.`);
    } else if (output.includes('tenant or user not found')) {
      console.log(`Region ${region} rejected: tenant or user not found.`);
    } else {
      console.log(`Region ${region} error: ${output.substring(0, 100).replace(/\n/g, ' ')}...`);
    }
  }
}
console.log('Done testing all regions.');
