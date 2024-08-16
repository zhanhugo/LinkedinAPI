import express from "express";
const router = express.Router();
import { UnipileClient } from "unipile-node-sdk";
import axios from "axios";

const apiKey = "wnGwYz9n.n3a3hH55dOuTdcOR37JL7Idh3ofZ6AoeLK9BDJQt2qA=";

const client = new UnipileClient("https://api3.unipile.com:13349", apiKey);

router.post("/login-link", async (req, res) => {
  try {
    const { success_redirect_url, failure_redirect_url } = req.body;
    const expireTime = new Date();
    expireTime.setHours(expireTime.getHours() + 1);
    const response = await client.account.createHostedAuthLink({
      type: "create",
      api_url: "https://api3.unipile.com:13349",
      success_redirect_url: success_redirect_url,
      failure_redirect_url: failure_redirect_url,
      expiresOn: expireTime.toISOString(),
      providers: ["LINKEDIN"],
      notify_url: "https://linkedinapi-production-1eda.up.railway.app/notify",
    });
    return res.status(200).send(response);
  } catch (error) {
    console.log("/login-link error: ", error);
    return res.status(500).send(error);
  }
});

router.get("/notify", async (req, res) => {
  console.log(req.body);
  return res.status(200).send("OK");
});

router.post("/search-people", async (req, res) => {
  try {
    const { account_id, search_url, cursor, limit } = req.body;

    let url = `https://api3.unipile.com:13349/api/v1/linkedin/search?account_id=${account_id}`;

    if (cursor) {
      url += `&cursor=${cursor}`;
    }
    if (limit) {
      url += `&limit=${limit}`;
    }

    const options = {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "X-API-KEY": apiKey,
      },
    };

    const body = {
      api: "classic",
      category: "people",
      url: search_url,
    };

    const result = await axios.post(url, body, options);
    return res.status(200).send(result.data);
  } catch (error) {
    console.log("/search-people error: ", error);
    return res.status(500).send(error);
  }
});

router.post("/get-profile", async (req, res) => {
  try {
    const { account_id, identifier } = req.body;
    const response = await client.users.getProfile({ account_id, identifier });
    return res.status(200).send(response);
  } catch (error) {
    console.log("/get-profile error: ", error);
    return res.status(500).send(error);
  }
});

router.post("/send-connection-request", async (req, res) => {
  try {
    const { account_id, identifier, message } = req.body; //message need to be <300 characters
    const target = await client.users.getProfile({ account_id, identifier });
    const provider_id = target.provider_id;
    const response = await client.users.sendInvitation({
      account_id,
      provider_id,
      message,
    });
    console.log(JSON.stringify(response));
    return res.status(200).send(response);
  } catch (error) {
    console.log("/send-connection-request error: ", error);
    return res.status(500).send(error);
  }
});

router.post("/get-all-connections", async (req, res) => {
  try {
    const { account_id, cursor, limit } = req.body;

    const params = {
      account_id,
    };

    if (cursor) {
      params.cursor = cursor;
    }

    if (limit) {
      params.limit = limit;
    }
    const response = await client.users.getAllRelations(params);
    return res.status(200).send(response);
  } catch (error) {
    console.log("/get-all-connections error: ", error);
    return res.status(500).send(error);
  }
});

router.post("/get-all-posts", async (req, res) => {
  try {
    const { account_id, identifier, cursor, limit } = req.body;

    const params = {
      account_id,
      identifier,
    };

    if (cursor) {
      params.cursor = cursor;
    }

    if (limit) {
      params.limit = limit;
    }

    const response = await client.users.getAllPosts(params);

    return res.status(200).send(response);
  } catch (error) {
    console.log("/get-all-posts error: ", error);
    return res.status(500).send(error);
  }
});

router.post("/search-posts", async (req, res) => {
  try {
    const { account_id, search_url, start = 0 } = req.body;
    const url = "https://api3.unipile.com:13349/api/v1/linkedin";
    const options = {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "X-API-KEY": apiKey,
      },
    };

    function processLinkedInSearchUrl(searchUrl, start, count) {
      const url = new URL(searchUrl);
      const params = new URLSearchParams(url.search);

      const keywords = params.get("keywords");
      const contentType = params.get("contentType");
      const datePosted = params.get("datePosted");
      const postedBy = params.get("postedBy");
      const sortBy = params.get("sortBy");

      const queryParameters = [];

      if (contentType) {
        queryParameters.push(`(key:contentType,value:List(${contentType}))`);
      }
      if (datePosted) {
        queryParameters.push(`(key:datePosted,value:List(${datePosted}))`);
      }
      if (postedBy) {
        queryParameters.push(
          `(key:postedBy,value:List(${postedBy.replace(/[\[\]\"]/g, "")}))`
        );
      }
      if (sortBy) {
        queryParameters.push(`(key:sortBy,value:List(${sortBy}))`);
      }

      queryParameters.push(`(key:resultType,value:List(CONTENT))`);

      const variables = `(start:${start},origin:FACETED_SEARCH,query:(keywords:${encodeURIComponent(
        keywords
      )},flagshipSearchIntent:SEARCH_SRP,queryParameters:List(${queryParameters.join(
        ","
      )})),count:${count})`;

      const queryId =
        "voyagerSearchDashClusters.37920f17209f22c510dd410658abc540";

      return {
        variables,
        queryId,
      };
    }

    const query_params = processLinkedInSearchUrl(search_url, start, 3);

    const body = JSON.stringify({
      query_params: query_params,
      account_id: account_id,
      request_url: "https://www.linkedin.com/voyager/api/graphql",
      method: "GET",
      encoding: false,
    });

    const result = await axios.post(url, body, options);
    const elements =
      result.data.data.data.searchDashClustersByAll?.elements || [];
    const posts = [];
    await Promise.all(
      elements.map(async (element) => {
        const items = element.items || [];
        await Promise.all(
          items.map(async (item) => {
            const postUrn =
              item.item.searchFeedUpdate?.update.metadata.backendUrn;
            if (postUrn === undefined) {
              return;
            }
            const response = await client.users.getPost({
              account_id,
              post_id: postUrn,
            });
            posts.push(response);
          })
        );
      })
    );
    return res.status(200).send(posts);
  } catch (error) {
    console.log("/search-posts error: ", error);
    return res.status(500).send(error);
  }
});

router.post("/get-post", async (req, res) => {
  try {
    const { account_id, post_id } = req.body;
    const response = await client.users.getPost({ account_id, post_id });
    return res.status(200).send(response);
  } catch (error) {
    console.log("/get-post error: ", error);
    return res.status(500).send(error);
  }
});

router.post("/comment", async (req, res) => {
  try {
    const { account_id, post_id, text } = req.body;
    const response = await client.users.sendPostComment({
      account_id,
      post_id,
      text,
    });
    console.log(JSON.stringify(response));
    return res.status(200).send(response);
  } catch (error) {
    console.log("/comment error: ", error);
    return res.status(500).send(error);
  }
});

router.post("/react", async (req, res) => {
  try {
    const { account_id, post_id, reaction_type = "like" } = req.body; //reaction_type: like, celebrate, support, love, insightful, funny

    const response = await client.users.sendPostReaction({
      account_id,
      post_id,
      reaction_type,
    });
    console.log(JSON.stringify(response));
    return res.status(200).send(response);
  } catch (error) {
    console.log("/comment error: ", error);
    return res.status(500).send(error);
  }
});

router.post("/dm", async (req, res) => {
  try {
    const { account_id, text, identifier } = req.body;
    const target = await client.users.getProfile({ account_id, identifier });
    const attendee_id = target.provider_id;
    console.log("attendee_id: ", attendee_id);
    const response = await client.messaging.startNewChat({
      account_id: account_id,
      text: text,
      attendees_ids: [attendee_id],
      options: {
        linkedin: {
          api: "classic",
          inmail: false,
        },
      },
    });

    return res.status(200).send(response); // response includes chat_id
  } catch (error) {
    console.log("/dm error: ", error);
    return res.status(500).send(error);
  }
});

export default router;
