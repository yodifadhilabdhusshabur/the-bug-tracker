import React from 'react';
import realTimePic from '../../assets/undraw_real_time_collaboration_c62i.png';
import personalPic from '../../assets/undraw_my_files_swob.png';
import statisticsPic from '../../assets/undraw_charts_jj6t.png';
import Feature from './Feature';

const features = [
	{
		head: '1.Realtime Environment',
		text:
			'If someone changed something in your team projects/bugs, these changes will get changed in front of you immediately',
		pic: realTimePic
	},
	{
		head: '2.Personal Environment',
		text: 'You can also start tracking your side projects in an individual environment',
		pic: personalPic
	},
	{
		head: '3.Statistics Visualization',
		text: 'Your team and projects statistics will get visualized so you can easily know if you are on track',
		pic: statisticsPic
	}
];
function Features() {
	return (
		<div className='container' id='Features'>
			{features.map((feature, i) => (
				<Feature key={i} head={feature.head} text={feature.text} pic={feature.pic} />
			))}
		</div>
	);
}

export default Features;
