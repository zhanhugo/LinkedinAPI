const exampleProfile = {
  object: "UserProfile",
  provider: "LINKEDIN",
  provider_id: "ACoAAATLQloBvS2aLpXyU8aBt_OtjTVqH_XQu-0",
  public_identifier: "julienhoachuck",
  first_name: "Julien",
  last_name: "Hoachuck",
  headline: "Founding Engineer & CEO @ ArkiTask - Ex-Microsoft AI",
  primary_locale: { country: "US", language: "en" },
  is_premium: true,
  is_influencer: false,
  is_creator: true,
  is_relationship: false,
  is_self: false,
  websites: [],
  location: "San Francisco Bay Area",
  profile_picture_url:
    "https://media.licdn.com/dms/image/C5603AQHKM9XEMuNltA/profile-displayphoto-shrink_100_100/0/1588918695365?e=1727913600&v=beta&t=VW_Ua1PRp4jRLTbg5SmVSnihqJP11ONlSmITLRrYyE4",
  background_picture_url:
    "https://media.licdn.com/dms/image/D5616AQHjdgiY_9EUcg/profile-displaybackgroundimage-shrink_200_800/0/1704759467874?e=1727913600&v=beta&t=EoPugi92xrHCG2FKPpHwPWhtwk8e_U_ESZwxCBtQCVY",
  hashtags: ["#ai", "#jira", "#scrum", "#engineering", "#machinelearning"],
};

const examplePost = {
  object: "Post",
  provider: "LINKEDIN",
  social_id: "urn:li:activity:7197705946201030657",
  share_url:
    "https://www.linkedin.com/posts/yann-lecun_it-seems-to-me-that-before-urgently-figuring-activity-7197705946201030657-q51E?utm_source=combined_share_message&utm_medium=member_desktop",
  date: "2mo",
  parsed_datetime: "2024-05-31T02:28:40.475Z",
  comment_counter: 548,
  impressions_counter: 0,
  reaction_counter: 7735,
  repost_counter: 528,
  permissions: {
    can_post_comments: true,
    can_react: true,
    can_share: true,
  },
  text: 'It seems to me that before "urgently figuring out how to control AI systems much smarter than us" we need to have the beginning of a hint of a design for a system smarter than a house cat.\n\nSuch a misplaced sense of urgency reveals an extremely distorted view of reality.\nNo wonder the more based members of the organization seeked to marginalize the superalignment group.\n\nIt\'s as if someone had said in 1925 "we urgently need to figure out how to control aircrafts that can transport hundreds of passengers at near the speed of sound over the oceans."\nIt would have been difficult to make long-haul passenger jets safe before the turbojet was invented and before any aircraft had crossed the atlantic non-stop.\nYet, we can now fly halfway around the world on twin-engine jets in complete safety. \nIt didn\'t require some sort of magical recipe for safety.\nIt took decades of careful engineering and iterative refinements.\n\nThe process will be similar for intelligent systems.\nIt will take years for them to get as smart as cats, and more years to get as smart as humans, let alone smarter (don\'t confuse the superhuman knowledge accumulation and retrieval abilities of current LLMs with actual intelligence).\nIt will take years for them to be deployed and fine-tuned for efficiency and safety as they are made smarter and smarter.\n\nhttps://lnkd.in/eaJ5uuMk',
  attachments: [
    {
      id: "D4E22AQGIXMp66PFEqg",
      sticker: false,
      size: {
        height: 1536,
        width: 912,
      },
      unavailable: false,
      type: "img",
      url: "https://media.licdn.com/dms/image/D4E22AQGIXMp66PFEqg/feedshare-shrink_2048_1536/0/1716066822904?e=1725494400&v=beta&t=AM6dDXK2Dsnaj8oG1aZsj4M3cpdoQJ7Vkh7kI0Llsy8",
    },
  ],
  author: {
    public_identifier: "yann-lecun",
    name: "Yann LeCun",
    is_company: false,
    headline: "VP & Chief AI Scientist at Meta",
  },
  is_repost: true,
  id: "7197705946201030657",
  repost_id: "7197765411617034240",
  reposted_by: {
    public_identifier: "julienhoachuck",
    name: "Julien Hoachuck",
    is_company: false,
  },
};

const exampleConnectionRequestSent = {
  object: "UserInvitationSent",
  invitation_id: "7224673722165518336",
};

const exampleCommentSent = {
  object: "CommentSent",
};
