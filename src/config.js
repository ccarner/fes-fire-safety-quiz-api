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

//static properties
Config.serverUrl =
  process.env.REACT_APP_PRODUCTION_URL || "http://localhost:8000";
Config.urls = {
  quiz: "/content/quizzes",
  media: "/content/media",
  modules: "/content/modules",
  checklists: "/content/checklists"
};
Config.IndexFileName = "index.json";

export default Config;
