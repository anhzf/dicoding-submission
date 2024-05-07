import type ThreadRepository from '../../domains/threads/ThreadRepository.mjs';
import InsertThread from '../../domains/threads/entities/InsertThread.mjs';

export default class AddThreadUseCase {
  #threadRepository: ThreadRepository;

  constructor({ threadRepository }: { threadRepository: ThreadRepository }) {
    this.#threadRepository = threadRepository;
  }

  async execute(useCasePayload: Omit<InsertThread, 'ownerId'>, credential: AuthenticatedUser) {
    const { title, body } = useCasePayload;
    const ownerId = credential.id;
    const thread = new InsertThread({ ownerId, title, body });
    return this.#threadRepository.insert(thread);
  }
}
