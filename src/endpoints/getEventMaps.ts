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

  const mapsPlayedData = JSON.parse(toArray($('.graph '))[0].attr('data-fusionchart-config'));
  var mapsPlayed = {};
  for(const data of mapsPlayedData.dataSource.data) {
    mapsPlayed[data.label] = Number(data.value);
  }


  const winRateData = JSON.parse(toArray($('.graph '))[1].attr('data-fusionchart-config'));
  var winRates = {};
  for(var i = 0; i < winRateData.dataSource.categories[0].category.length; i++) {
    winRates[winRateData.dataSource.categories[0].category[i].label] = {
      "CT": Number(winRateData.dataSource.dataset[0].data[i].value),
      "T": Number(winRateData.dataSource.dataset[1].data[i].value)
    }
  }

  return {
    maps,
    mapsPlayed,
    winRates
  };
}
