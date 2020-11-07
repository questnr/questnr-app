import { QPage } from './page.model';

export class FaqItemPage {
    category: string;
    description: string;
    faqItemPage: QPage<FaqItem>;
}

export class FaqItem {
    question: string;
    answer: string;
}

export class FaqClassificationSearchDTO {
    category: string;
    description: string;
    publicId: string;
}

export class FaqItemSearchPage {
    faqClassification: FaqClassificationSearchDTO;
    question: string;
    answer: string;
}

export enum FaqItemType {
    classified = 'classified',
    searched = 'searched'
}
