import { faker } from '@faker-js/faker';
async function seed() {
  for (let i = 0; i < 10_000; i++) {
    const headersList = {
      Accept: '*/*',
      'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdyYWNlIiwic3ViIjozLCJpYXQiOjE3MDQ0NDgzOTUsImV4cCI6MTcwNDQ4NDM5NX0.Z9j9exjofAseig0kKAD8PNPD3benkvA7GSsY4_gC78s',
      'Content-Type': 'application/json',
    };

    const bodyContent = JSON.stringify({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
    });

    const response = await fetch('http://localhost:3100/notes', {
      method: 'POST',
      body: bodyContent,
      headers: headersList,
    });

    const data = await response.json();
    console.log(data);
  }
}
seed();
