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

function generateStoryMarkup(story,) {

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


function createDeleteBtn() {
  return `<button class="delete"> Delete</button>`
}

// Creates a user story and appends it to the page
async function getNewStoryInfo(evt) {
  const userStory = true;
  console.log(evt)
  evt.preventDefault();

  if ($storiesForm.show()) {

    const $title = $("#story-title").val();
    const $author = $("#story-author").val();
    const $url = $("#story-url").val();
    const obj = { title: $title, author: $author, url: $url }
    const createdStory = await storyList.addStory(currentUser, obj)

    const $generateStory = generateStoryMarkup(createdStory, userStory);

    $allStoriesList.append($generateStory);
    $storiesForm.trigger("reset")
    $storiesForm.slideUp("slow")
  }
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);

    $allStoriesList.prepend($story);
  }

  $allStoriesList.show();
}

$storiesForm.on("submit", getNewStoryInfo);


// Deletes a user story
async function deleteYourStory(evt) {
  evt.preventDefault()
  const $title = $("#delete-story-title").val();

  for (let story of storyList.stories) {
    if (story.title === $title) {
      storyList.deleteStory(currentUser, story.storyId)
      $allStoriesList.remove(story);
    }
  }

  $("#delete-stories-form").trigger("reset");
  $("#delete-stories-form").slideUp("slow");

  putStoriesOnPage()

}

$("#delete-stories-form").on("submit", deleteYourStory)