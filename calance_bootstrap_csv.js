const axios = require('axios');
const fs = require('fs');

const generateOptions = (hostName, path) => {
  return options = {
    url: `https://${hostName}${path}`,
    headers: {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  }
}

const processInfo = async (csvTitle) => {
  const options = generateOptions('api.github.com', '/repos/twbs/bootstrap/releases');

  await axios.get(options.url, { headers: options.headers })
    .then((res) => {
      repos = res.data
  }).catch('error', (err) => {
      console.log(err);
      res.status(500).send({
        message: constants.errorMessage
      });
  })

  if (repos) {
    repos = repos.map((repo) => (
      {
        created_at: new Date(repo.created_at).toUTCString().replace(',', ''),
        tag_name: repo.tag_name,
        zipball_url: repo.zipball_url
      }
    ))
  }

  const refinedData = []
  refinedData.push(Object.keys(repos[0]))
  repos.forEach((repo) => {
    refinedData.push(Object.values(repo))  
  })
  let csvContent = "";
  refinedData.forEach((rowArray) => {
    let row = rowArray.join(",");
    csvContent += row + "\r\n";
  });

  fs.writeFile(csvTitle, csvContent, "utf-8", (err) => {
    if (err) console.log(err);
    else console.log("...File Created");
  });
}

processInfo("bootstrap_github_info.csv");