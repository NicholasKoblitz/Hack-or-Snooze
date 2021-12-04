"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

async function getNewStoryInfo(evt) {
  console.log(evt)
  evt.preventDefault();

  if ($storiesForm.show()) {

    const $title = $("#story-title").val();
    const $author = $("#story-author").val();
    const $url = $("#story-url").val();
    const obj = { title: $title, author: $author, url: $url }
    const createdStory = await storyList.addStory(currentUser, obj)

    const $generateStory = generateStoryMarkup(createdStory);

    $allStoriesList.append($generateStory);
    $storiesForm.trigger("reset")

    $storiesForm.hide();

  }

}



/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


$storiesForm.on("submit", getNewStoryInfo);


async function deleteYourStory(evt) {
  const stories = await StoryList.getStories();
  console.log(evt.target)
  let response;

  for (let story of stories.stories) {
    console.log(story)
    if (evt.target.id === story.storyId) {
      response = await axios({
        url: `${BASE_URL}/stories/${story.storyId}`,
        method: "DELETE",
        data: {
          token: currentUser.loginToken
        }
      })
    }
  }

}


function getli() {
  const storyLink = (document.getElementsByTagName("li"))
  const liList = []

  for (let li of Array.from(storyLink)) {
    console.log(li.children)
    li.addEventListener("click", deleteYourStory)
    liList.push(li)
  }
  console.log(liList)
}