export interface PrivacyPolicyTranslations {
  header: {
    title: string;
    lastUpdate: string;
  };

  introduction: {
    description: string;

    serviceUsageList: {
      downloadApp: string;
      usePlatform: string;
      interactWithUs: string;
    };

    questionsSection: {
      title: string;
      description: string;
      contactEmail: string;
    };
  };
  summary: {
    title: string;

    intro: string;

    personalInfo: {
      title: string;
      description: string;
    };

    sensitiveInfo: {
      title: string;
      description: string;
    };

    thirdPartyInfo: {
      title: string;
      description: string;
    };

    processInfo: {
      title: string;
      description: string;
    };

    sharingInfo: {
      title: string;
      description: string;
    };

    security: {
      title: string;
      description: string;
    };

    rights: {
      title: string;
      description: string;
    };

    rightsExercise: {
      title: string;
      description: string;
    };

    closing: string;
  };
  index: {
    title: string;
    sections: {
      infocollect: string;
      infouse: string;
      legalbases: string;
      whoshare: string;
      whyshare: string;
      cookies: string;
      ai: string;
      sociallogins: string;
      inforetain: string;
      infosafe: string;
      privacyrights: string;
      DNT: string;
      uslaws: string;
      otherlaws: string;
      policyupdates: string;
      contact: string;
      request: string;
      restrictions: string;
      csae: string;
    };
  };
  infoCollect: {
    title: string;

    personalDisclosure: {
      title: string;

      summary: {
        label: string;
        description: string;
      };

      voluntaryCollection: string;

      personalInfoProvided: {
        title: string;
        description: string;

        list: {
          names: string;
          emails: string;
          usernames: string;
          passwords: string;
          contactPreferences: string;
          contactOrAuthData: string;
          camera: string;
          geolocation: string;
          wifi: string;
          mobileData: string;
          userId: string;
          googlePlayServices: string;
          localStorage: string;
        };
      };

      sensitiveInfo: {
        title: string;

        list: {
          sexualLife: string;
          userData: string;
          additionalInfo: string;
        };
      };

      basicInfo: {
        title: string;

        list: {
          relationship: string;
          zodiac: string;
          relationshipType: string;
          hasChildren: string;
          interests: string;
        };
      };

      paymentData: {
        title: string;
        description: string;
      };
    };
  };
  socialLoginData: {
    title: string;
    descriptionBeforeLink: string;
    linkText: string;
    descriptionAfterLink: string;
  };

  applicationData: {
    title: string;
    description: string;

    list: {
      geolocation: {
        title: string;
        description: string;
      };

      mobileAccess: {
        title: string;
        description: string;
      };

      deviceData: {
        title: string;
        description: string;
      };

      pushNotifications: {
        title: string;
        description: string;
      };

      internetAccess: {
        title: string;
        description: string;
      };

      mobileCarrierCharges: string;
    };
  };
  thirdPartyAccess: {
    title: string;
    description: string;
    services: {
      googlePlayServices: string;
      googleAnalytics: string;
    };
  };

  dataUsagePurpose: string;

  dataAccuracyNotice: string;

  automaticCollection: {
    title: string;
    summary: string;
    description: string;
    cookiesInfo: string;
    collectedInfoTitle: string;

    list: {
      logAndUsageData: {
        title: string;
        description: string;
      };

      deviceData: {
        title: string;
        description: string;
      };

      locationData: {
        title: string;
        description: string;
      };
    };
  };
  googleApi: {
    title: string;
    descriptionBeforeFirstLink: string;
    googlePolicyLinkText: string;
    descriptionMiddle: string;
    limitedUseLinkText: string;
    descriptionEnd: string;
  };

  otherSources: {
    title: string;

    summary: string;

    description: string;

    socialMediaInteraction: {
      descriptionBeforeLink: string;
      withdrawConsentLinkText: string;
      descriptionAfterLink: string;
    };
  };
  informationProcessing: {
    title: string;
    summary: string;
    description: string;
  };
  processingPurposes: {
    accountManagement: {
      title: string;
      description: string;
    };

    serviceDelivery: {
      title: string;
      description: string;
    };

    userSupport: {
      title: string;
      description: string;
    };

    administrativeInformation: {
      title: string;
      description: string;
    };

    orderManagement: {
      title: string;
      description: string;
    };

    userCommunication: {
      title: string;
      description: string;
    };

    feedback: {
      title: string;
      description: string;
    };

    marketingCommunication: {
      title: string;
      descriptionBeforeLink: string;
      privacyRightsLinkText: string;
      descriptionAfterLink: string;
    };

    targetedAdvertising: {
      title: string;
      description: string;
    };

    serviceProtection: {
      title: string;
      description: string;
    };

    usageTrends: {
      title: string;
      description: string;
    };

    campaignEffectiveness: {
      title: string;
      description: string;
    };

    vitalInterest: {
      title: string;
      description: string;
    };
  };
  legalBasesSection: {
    title: string;
    summary: string;
    euUkNotice: string;
    gdprExplanation: string;
  };
  legalBasesList: {
    consent: {
      title: string;
      description: string;
      withdrawConsentLinkText: string;
    };

    contractPerformance: {
      title: string;
      description: string;
    };
    legitimateInterests: {
      title: string;
      description: string;
      purposes: {
        specialOffers: string;
        personalizedAdvertising: string;
        serviceUsageAnalysis: string;
        marketingSupport: string;
        fraudPrevention: string;
        userExperienceImprovement: string;
      };
    };

    legalObligations: {
      title: string;
      description: string;
    };

    vitalInterests: {
      title: string;
      description: string;
    };
  };
  canadaLegalBasesSection: {
    notice: string;

    consentExplanation: {
      description: string;
      withdrawConsentLinkText: string;
    };

    exceptionalCasesIntro: string;

    exceptionalCases: {
      urgentCollection: string;
      fraudInvestigation: string;
      businessTransactions: string;
      witnessStatement: string;
      identifyInjuredPersons: string;
      financialAbuseVictim: string;
      agreementViolationInvestigation: string;
      legalDisclosure: string;
      employmentProducedInformation: string;
      journalisticPurpose: string;
      publiclyAvailableInformation: string;
    };
  };
  shareInformationSection: {
    title: string;

    summary: string;

    thirdPartyServices: {
      title: string;
      description: string;
    };

    categoriesIntro: string;

    categories: {
      adNetworks: string;
      aiPlatforms: string;
      cloudComputing: string;
      communicationTools: string;
      dataAnalytics: string;
      dataStorageProviders: string;
      paymentProcessors: string;
      performanceMonitoring: string;
      productEngineeringTools: string;
      socialNetworks: string;
      accountRegistrationServices: string;
    };

    situationsIntro: string;

    situations: {
      businessTransfers: {
        title: string;
        description: string;
      };

      googleMapsApis: {
        title: string;
        description: string;
        learnMoreLinkText: string;
      };

      businessPartners: {
        title: string;
        description: string;
      };

      otherUsers: {
        title: string;
        description: string;
      };
    };
  };
  thirdPartyWebsitesSection: {
    title: string;
    summary: string;
    description: string;
  };

  cookiesSection: {
    title: string;
    summary: string;

    trackingIntro: string;
    trackingSecurity: string;
    trackingAdvertising: string;

    usOptOutExplanation: string;
    usOptOutLinkText: string;

    cookieNoticeReference: string;

    googleAnalytics: {
      title: string;
      description: string;
      optOutLink: string;
      adsSettingsLinkText: string;
      networkAdvertisingOptOut: string;
      mobileChoiceOptOut: string;
      googlePrivacyLinkText: string;
    };

    appCookieSummary: {
      summaryLabel: string;
      summary: string;

      googleAuthTitle: string;
      googleAuthDescription: string;

      admobTitle: string;
      admobDescription: string;

      analyticsTitle: string;
      analyticsDescription: string;
    };

    cookieManagement: {
      title: string;
      description: string;
      googleCookiePolicyLinkText: string;
    };
  };
  aiSection: {
    title: string;

    summaryLabel: string;
    summary: string;

    description: string;

    openAiTitle: string;
    openAiDescription: string;

    legalBasesLinkText: string;

    openAiPrivacyLinkText: string;

    productsTitle: string;
    productsIntro: string;

    products: {
      completeProfile: string;
      chatSuggestions: string;
      matchAnalysis: string;
    };

    processingTitle: string;
    processingDescription: string;
  };
  socialLoginSection: {
    title: string;

    summaryLabel: string;
    summary: string;

    description: string;

    usageDescription: string;
  };

  dataRetentionSection: {
    title: string;

    summaryLabel: string;
    summary: string;

    retentionDescription: string;

    deletionDescription: string;
  };
  dataRetentionSectionSecurity: {
    title: string;
    paragraph1: string;
    paragraph2: string;
  };
  privacyRightsSection: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    contactLinkText: string;
    paragraph3: string;
    paragraph4: string;
    euAuthorityLinkText: string;
    ukAuthorityLinkText: string;
    paragraph5: string;
    swissAuthorityLinkText: string;
    withdrawConsentTitle: string;
    withdrawConsentParagraph1: string;
    withdrawConsentLinkText: string;
    withdrawConsentParagraph2: string;
  };

  accountInformationSection: {
    title: string;
    paragraph1: string;
    cookiesTitle: string;
    cookiesParagraph: string;
    advertisingOptOutLinkText: string;
    paragraph2: string;
  };
  dntSection: {
    title: string;
    paragraph1: string;
    paragraph2: string;
  };
  usPrivacyRightsSection: {
    title: string;
    summary: string;

    categoriesTitle: string;
    categoriesDescription: string;

    table: {
      headers: {
        category: string;
        examples: string;
        collected: string;
      };
      rows: {
        category: string;
        examples: string;
        collected: string;
      }[];
    };

    sensitiveInfoParagraph: string;
    additionalCollectionParagraph: string;

    interactionList: string[];

    retentionIntro: string;
    retentionList: string[];

    sourcesTitle: string;
    sourcesParagraph: string;
    sourcesLinkText: string;

    sharingQuestion: string;
    sharingParagraph: string;
    sharingLinkText: string;

    businessPurposeParagraph: string;
    thirdPartyParagraph: string;
    thirdPartyLinkText: string;

    rightsTitle: string;
    rightsIntro: string;
    rightsList: string[];

    stateAdditionalRightsIntro: string;
    stateAdditionalRightsList: string[];

    howExerciseTitle: string;
    howExerciseParagraph: string;

    authorizedAgentParagraph: string;

    verificationTitle: string;
    verificationParagraph1: string;
    verificationParagraph2: string;

    appealsTitle: string;
    appealsParagraph: string;

    shineTheLightTitle: string;
    shineTheLightParagraph: string;
    contactLinkText: string;
  };
  otherRegionsRightsSection: {
    title: string;
    summary: {
      strong: string;
      text: string;
    };
  };
  australiaNewZealandSection: {
    title: string;

    paragraph1: {
      part1: string;
      australiaPrivacyAct: string;
      part2: string;
      newZealandPrivacyAct: string;
      part3: string;
    };

    paragraph2: string;

    paragraph3: {
      part1: string;
      part2: string;
    };

    servicesList: {
      item1: string;
      item2: string;
      item3: string;
      item4: string;
    };

    paragraph4: {
      part1: string;
      linkText: string;
    };

    paragraph5: {
      part1: string;
      part2: string;
      australianOfficeLink: string;
      part3: string;
      newZealandOfficeLink: string;
    };
  };
  policyUpdatesSection: {
    title: string;
    summary: {
      strong: string;
      text: string;
    };
    paragraph1: string;
  };

  contactSection: {
    title: string;
    paragraph1: {
      part1: string;
      email: string;
      part2: string;
    };
    address: {
      line1: string;
      line2: string;
      line3: string;
      line4: string;
    };
  };

  requestSection: {
    title: string;
    paragraph1: {
      part1: string;
      email: string;
      part2: string;
    };
  };

  minorsRestrictionSection: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    paragraph4: string;
    paragraph5: string;
  };

  reportsSection: {
    title: string;
    paragraph1: {
      part1: string;
      email: string;
      part2: string;
    };
    paragraph2: {
      part1: string;
      reportChildAbuse: string;
      part2: string;
      reportFamilyContent: string;
    };
  };

  csaeSection: {
    title: string;
    paragraph1: string;
    paragraph2: {
      strong: string;
    };
    paragraph3: {
      part1: string;
      transparencyLink: string;
      part2: string;
    };
    paragraph4: {
      part1: string;
      contactLink: string;
      part2: string;
    };
    paragraph5: {
      part1: string;
      transparencyLink: string;
    };
  };
}
