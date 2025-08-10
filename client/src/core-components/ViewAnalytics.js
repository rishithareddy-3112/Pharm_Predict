import React, { useState } from 'react'
import Layout from './Layout'
import { Row, Col, Card } from 'react-bootstrap';
const ViewAnalytics = () => {
    const [isClicked, setIsClicked] = useState(false);

    const handleImageClick = () => {
        setIsClicked(!isClicked);
    };
    const cardsData = [
        {
            title: 'Side Effects',
            description: 'The level of contribution of Side effects',
            image: '../../Side Effects.png'
        },
        {
            title: 'Habit Forming',
            description: 'Indicating the level to which a  particular therapeutic class leads to habit forming',
            image: '../../Therapeutic Class vs Habit Forming.png'
        },
        {
            title: 'Habit Forming',
            description: 'Indicating the level to which a  particular therapeutic class leads to habit forming',
            image: '../../Therapeutic Class vs Habit Forming2.png'
        },
        {
            title: 'Drugs and Habit Forming',
            description: 'Indicating the no.of drugs that lead to habit forming',
            image: '../../Habit Forming.png'
        }
    ];
    const renderCards = () => {
        return cardsData.map((card, index) => (
            <Col md={4} key={index} className="mb-4">
                <Card className={`h-800 shadow m-0 p-0 ${isClicked ? 'clicked' : ''}`} onClick={handleImageClick} style={{ cursor: 'pointer' }}>
                    <Card.Body>
                        <Card.Img src={card.image} alt={card.title} style={{ backgroundSize: 'cover' }} />
                        {isClicked && <div><Card.Title className="h4 text-center m-2">{card.title}</Card.Title> <Card.Text className="card-description text-center">{card.description}</Card.Text></div>}
                    </Card.Body>
                </Card>
            </Col>
        ));
    };
    return (
        <Layout>
            <Row className="my-2">
                {renderCards()}
            </Row>
        </Layout>
    )
}
export default ViewAnalytics