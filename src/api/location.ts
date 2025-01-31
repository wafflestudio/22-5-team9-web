export const setLocationStatus = async (tagId: number) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken == null) throw new Error('No access token found');

    const response = await fetch(
      `https://waffle-instaclone.kro.kr/api/location/status?tag_id=${tagId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Location status update failed');
    }

    return true;
  } catch (error) {
    console.error('Error setting location:', error);
    return false;
  }
};

export const getLocationFriends = async (
  locationId: number,
): Promise<number[]> => {
  try {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken == null) throw new Error('No access token found');

    const response = await fetch(
      `https://waffle-instaclone.kro.kr/api/location/world?location_id=${locationId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch location friends');
    }

    return (await response.json()) as number[];
  } catch (error) {
    console.error('Error fetching location friends:', error);
    return [];
  }
};

export const getMyLocation = async () => {
  try {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken == null) throw new Error('No access token found');

    const response = await fetch(
      'https://waffle-instaclone.kro.kr/api/location/my',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch my location');
    }
    return (await response.json()) as number;
  } catch (error) {
    console.error('Error fetching my location:', error);
    return [];
  }
};
