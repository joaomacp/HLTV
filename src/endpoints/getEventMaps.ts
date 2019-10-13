import { HLTVConfig } from '../config'
import { fetchPage, toArray } from '../utils/mappers'

export const getEventMaps = (config: HLTVConfig) => async ({
  id
}: {
  id: number
}): Promise<any> => {
  const $ = await fetchPage(`${config.hltvUrl}/stats/maps?event=${id}`, config.loadPage);

  const maps = toArray($('.maps-navigation-desc')).map(eventEl => ({
    name: eventEl.text()
  }));

  // TODO add maps played, map win percentages by CT/T side, etc.

  return {
    maps
  };
}
