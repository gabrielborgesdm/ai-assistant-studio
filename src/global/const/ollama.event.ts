import { ModelDownload } from '@global/types/model'
import { EventCancel, EventReply } from '@global/const/event'

export const ChatEvent = 'ollama-chat'
export const ChatEventReply = EventReply(ChatEvent)
export const ChatEventCancel = EventCancel(ChatEvent)

export const OllamaIsInstalledEvent = 'ollama-is-installed'

export const DownloadModelEvent = 'ollama-download-model'
export const getDownloadModelEventReply = (model: ModelDownload): string =>
  EventReply(DownloadModelEvent + model.name)
export const getDownloadModelEventCancel = (model: ModelDownload): string =>
  EventCancel(DownloadModelEvent + model.name)

export const ListModelsEvent = 'ollama-list-models'

export const SearchOnlineModelsEvent = 'ollama-search-online-models'
