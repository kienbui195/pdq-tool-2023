import * as React from 'react';

const useMediaQuery = () => {
    const [width, setWidth] = React.useState(0)

    React.useEffect(() => {
        const handleResize = (e) => {
            setWidth(e.innerWidth)
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return {
        width
    }
}

export default useMediaQuery;