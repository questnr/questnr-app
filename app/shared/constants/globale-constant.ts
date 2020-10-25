export class GlobalConstants {
  public static siteTitle = 'Questnr';
  public static siteLink = 'https://questnr.com';
  public static siteLogo = 'https://questnr.com/assets/logo.png';
  public static siteLogoExternalLink = 'https://lh3.googleusercontent.com/pw/ACtC-3cA5INfBc_BXY2vdXrlznXQ1QpPyhvkTx_WeFg21DxvymA0e4x7ZnoGb4UqkvFjnozBF9zbz8SDp5DQhVVFzR6bXB9xwhWLUahDR9hYcfE91XrHgmupHYyaipkmM4Cq0SlQ7r9FweUlGoV6x74ObA7y=s512-no';
  public static description = 'The New Era of Online Communities. Let\'s discuss what you love or any issues you have, know similar things from others to improve your skills. Create Post or Blog, or Ask a Question, Now!';
  public static image = '';
  public static fbAppId = '1336590906533811';
  public static gtagId = 'UA-168117128-1';
  public static welcomeTitle = 'Welcome To ' + GlobalConstants.siteTitle;
  public static loginTitle = 'Login To ' + GlobalConstants.siteTitle;
  public static signupTitle = 'Signup To ' + GlobalConstants.siteTitle;
  public static policyTitle = 'Privacy Policy | ' + GlobalConstants.siteTitle;
  public static termsOfUseTitle = 'Terms of Use | ' + GlobalConstants.siteTitle;
  public static cookiePolicyTitle = 'Cookie Policy | ' + GlobalConstants.siteTitle;

  public static signUpAgeRestriction = 16;

  public static feedPath = 'feed';
  public static termsPath = 'terms';
  public static policyPath = 'policy';
  public static cookiePath = 'cookie';
  public static userPath = 'user';
  public static communityPath = 'community';
  public static postPath = 'post';
  public static postBlogPath = 'blog';
  public static postQuestionPath = 'question';
  public static hashTagPath = 'hash-tag';
  public static headerPath = 'header';
  public static explorePath = 'explore';
  public static trendingPath = 'trending';
  public static contactPath = 'contact';

  public static supportEmail = 'support@questnr.com';
  public static noReplyEmail = 'noreply@questnr.com';
  public static helloEmail = 'hello@questnr.com';
  public static addressLine1 = 'New Delhi, India';
  public static termsLastUpdated = 'May 25, 2020';
  public static privacyLastUpdated = 'May 25, 2020';
  public static copyRightRenewedYear = '2020';
  public static resetPassword = 'reset';
  public static forgotPassword = 'forgot-password';
  public static login = 'login';
  public static signUp = 'sign-up';
  public static helpPath = 'help';
  public static questnrPath = 'questnr';
  public static error = 'error';
  public static questnrHelpTitle = GlobalConstants.siteTitle + ' Help';

  public static questnrFeedTitle = 'Questnr Feed';
  public static postTitle = 'Post | Questnr';
  public static postBlogTitle = 'Blog | Questnr';
  public static postQuestionTitle = 'Question | Questnr';

  public static getPolicyLink(): string {
    return this.siteLink + '/policy';
  }

  public static getFAQTitle(category: string): string {
    return [[
      category,
      'FAQ',
    ].join(' - '),
    GlobalConstants.questnrHelpTitle
    ].join(' | ');
  }

  public static getFAQDescription(category: string): string {
    return [
      GlobalConstants.questnrHelpTitle,
      category,
      'FAQ',
      `What are some frequently asked questions about ${category}?`
    ].join(' - ');
  }
}
