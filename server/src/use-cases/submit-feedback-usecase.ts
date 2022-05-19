import { MailAdapter } from "../adapters/mail-adapter";
import { FeedbacksRepository } from "../repositories/feedbacks-repository";

interface SubmitFeedbackUseCaseRequest {
  type: string,
  comment: string;
  screenshot?: string;
}

export class SubmitFeedbackUseCase {
  constructor(
    private feedbacksRepository: FeedbacksRepository,
    private mailAdapter: MailAdapter
  ){}

  async execute(request: SubmitFeedbackUseCaseRequest ) {
    try {
      const {type, comment, screenshot} = request;

      if(!type)
        throw new Error('Type is requited.');

      if(!comment)
        throw new Error('Comment is requited.');
        
      if(screenshot && !screenshot.startsWith('data:image/png;base64'))
        throw new Error('Invalid screenshot format.')

      await this.feedbacksRepository.create({
        type,
        comment,
        screenshot
      });

      await this.mailAdapter.sendMail({
        subject: 'Novo feedback',
        body:
        [
          `<p>Tipo de feedback: ${type}</p>`,
          `<p>Comentário: ${comment}</p>`,
          screenshot ? `<img src="${screenshot}" />` : false,
        ].join('\n')
      });
    } catch (error) {
      console.error(error);
    }
  }
}