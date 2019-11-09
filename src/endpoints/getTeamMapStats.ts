import { HLTVConfig } from '../config'
import { fetchPage, toArray } from '../utils/mappers'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const getTeamMapStats = (config: HLTVConfig) => async ({
  eventId, teamId
}: {
  eventId: number, teamId: number
}): Promise<any> => {
  var $ = await fetchPage(`${config.hltvUrl}/stats/teams/maps/${teamId}/-?event=${eventId}`, config.loadPage);

  const maps = toArray(toArray($('.tabs.standard-box'))[1].find('.stats-top-menu-item')).map(mapEl => ({
    name: mapEl.find('a').text(),
    url: mapEl.find('a').attr('href')
  }));

  for(const map of maps) {
    $ = await fetchPage(`${config.hltvUrl}${map.url}`, config.loadPage);

    map['timesPlayed'] = toArray(toArray($('.stats-row'))[0].find('span'))[1].text()
    
    const winPercentageData = JSON.parse(toArray($('.graph '))[0].attr('data-fusionchart-config'))

    map['ctRoundsWon'] = winPercentageData.dataSource.data[0].value;
    map['tRoundsWon'] = winPercentageData.dataSource.data[1].value;

    delete map.url

    await sleep(700);
  }

  return {
    maps
  };
}
