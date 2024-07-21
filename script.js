$(document).ready(function () {
    const apiKey = 'eba8b9a7199efdcb0ca1f96879b83c44';

    // Fetch movies
    function fetchMovies(category) {
        let url = '';
        switch (category) {
            case 'now-playing':
                url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`;
                break;
            case 'top-rated':
                url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
                break;
            case 'trending':
                url = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;
                break;
            case 'upcoming':
                url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
                break;
            default:
                url = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;
                break;
        }

        $.ajax({
            url: url,
            method: 'GET',
            headers: {
                accept: 'application/json'
            },
            success: function (data) {
                displayMovies(data.results);
            },
            error: function (error) {
                console.error('Error fetching movies:', error);
            }
        });
    }

    // DISP MOVIES
    function displayMovies(movies) {
        let box = '';
        const rowData = $('#rowData');

        movies.forEach(movie => {
            let title = movie.title || movie.name;
            let overview = movie.overview.length > 250 ? movie.overview.substring(0, 250) + '...' : movie.overview;
            let voteAverage = movie.vote_average.toFixed(1);

            box += `
                <div class="col-sm-12 col-md-3">
                    <div class="card movie-card">
                        <div class="cardImage">
                            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${title}" class="card-img">
                            <div class="overlay">
                                <div class="title">${title}</div>
                                <div class="desc">${overview}</div>
                                <div class="date">Release Date: ${movie.release_date}</div>
                                <div class="vote">${voteAverage}</div>
                            </div>
                        </div>
                    </div>
                </div>`;
        });

        rowData.html(box);
    }

    // SEARCH MOVIES
    function searchByName(name) {
        $.ajax({
            url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${name}&page=1`,
            method: 'GET',
            headers: {
                accept: 'application/json'
            },
            success: function (data) {
                displayMovies(data.results);
                $('#clear-search').removeClass('d-none');
            },
            error: function (error) {
                console.error('Error searching movies:', error);
            }
        });
    }

    // HIDDEN NAV LINKS
    $('#now-playing').on('click', () => fetchMovies('now-playing'));
    $('#top-rated').on('click', () => fetchMovies('top-rated'));
    $('#trending').on('click', () => fetchMovies('trending'));
    $('#upcoming').on('click', () => fetchMovies('upcoming'));

    // HIDDEN NAV
    $('#toggle-nav').on('click', function () {
        $('#hidden-nav').toggleClass('open');
        $('#hidden-nav').toggleClass('d-none');
    });

    // SEARCH INPUT 
    $('#search-input').on('input', function () {
        const query = $(this).val();
        if (query.length > 0) {
            searchByName(query);
            showClearButton();
        } else {
            $('#rowData').empty();
            hideClearButton();
        }
    });

    function showClearButton() {
        $('#clear-search').removeClass('d-none');
    }

    function hideClearButton() {
        $('#clear-search').addClass('d-none');
    }

    // CLEAR SEARCH AND SHOW MOVIES
    $('#clear-search').on('click', function () {
        $('#search-input').val('');
        $('#rowData').empty();
        $('#clear-search').addClass('d-none');
        fetchMovies('trending');
    });

    fetchMovies('now-playing');
});
