/*  This class is used by the application modules to get the API URLs etc.
    Provides a central way to change these URLs in the event that the server
    is modified */
class Config {
  static getUrl(type) {
    switch (type) {
      case "quiz":
        return Config.getQuizUrl();
      case "media":
        return Config.getMediaUrl();
      case "module":
        return Config.getModuleUrl();
      case "checklist":
        return Config.getChecklistUrl();
      default:
        return undefined;
    }
  }
  static getQuizUrl() {
    return this.serverUrl + this.urls.quiz;
  }
  static getMediaUrl() {
    return this.serverUrl + this.urls.media;
  }
  static getModuleUrl() {
    return this.serverUrl + this.urls.modules;
  }
  static getChecklistUrl() {
    return this.serverUrl + this.urls.checklists;
  }
  static getIndexFileName() {
    return this.IndexFileName;
  }
}

/* static properties of the class */

// the application requires the URL of the API to be passed in as an environment variable,
// if not passed in, it will use the development localhost url
Config.serverUrl =
  process.env.REACT_APP_PRODUCTION_URL || "http://localhost:8000";

// where the content is stored on the server
Config.urls = {
  quiz: "/content/quizzes",
  media: "/content/media",
  modules: "/content/modules",
  checklists: "/content/checklists"
};

// what the index is called in each content folder in the server
Config.IndexFileName = "index.json";

export default Config;
